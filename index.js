/* eslint class-methods-use-this: ["error", { "exceptMethods": ["upload", "download"] }] */
const fs = require('fs');
const path = require('path');
const axios = require('axios');

class TinypngPlugin {
    constructor(options = {}) {
        this.options = {
            extentions: ['png', 'jpg', 'jpeg'],
            silent: false,
            cache: true,
            ...options,
        };
        this.log('options: ', options);
        const extentions = this.options.extentions.join('|');
        this.tester = new RegExp(`\\.(${extentions})(\\?.*)?$`);
        this.dict = [];
    }
    apply(compiler) {
        const onEmit = async (compilation, callback) => {
            const files = await this.getFilesFromDirectory();
            this.getCache();
            await Promise.all(files.map(file => this.compressSingleFile(file)));
            this.setCache();
            this.log('finished!!');

            callback();
        };
        compiler.plugin('emit', onEmit);
    }

    log(info) {
        if (this.options.silent) {
            console.log(info);
        }
    }

    getCache() {
        const cachePath = path.resolve(__dirname, 'dict');
        if (fs.statSync(cachePath).isFile() && this.options.cache) {
            const cache = fs.readFileSync(cachePath);
            this.dict = JSON.parse(cache);
        } else {
            this.dict = [];
        }
    }

    setCache() {
        if (this.options.cache) {
            fs.writeFileSync(path.resolve(__dirname, 'dict'), JSON.stringify(this.dict));
        } else {
            fs.writeFileSync(path.resolve(__dirname, 'dict'), '[]');
        }
    }

    async compressSingleFile(file) {
        /* {
            input: { size: 1848, type: 'image/png' },
            output: {
                size: 1491,
                type: 'image/png',
                width: 92,
                height: 92,
                ratio: 0.8068,
                url: 'https://tinypng.com/web/output/85ur1eqa69tfxvmwu5eam5k4708831q3',
            },
        } */
        try {
            if (this.tester.test(file)) {
                const { size } = fs.statSync(file);
                if (!this.dict.find(el => el.filePath === file && el.size === size)) {
                    const { input, output } = await this.upload(file);
                    const compressedFile = await this.download(output.url);
                    this.log(
                        `${file}: original size <${input.size}B>, compressed size <${
                            output.size
                        }B>, compress ratio <${(output.ratio * 100).toFixed(2)}%>`,
                    );
                    fs.writeFileSync(file, compressedFile);
                    // set cache
                    this.dict.push({
                        filePath: file,
                        size: output.size,
                    });
                }
            }
        } catch (e) {
            this.log(e);
        }
    }

    async upload(filePath) {
        try {
            const file = fs.readFileSync(filePath);
            const { data } = await axios({
                method: 'post',
                url: 'https://tinypng.com/web/shrink',
                headers: { 'User-Agent': 'QQBrowser' },
                data: file,
            });
            return data;
        } catch (err) {
            if (err.response) {
                const { data } = err.response;
                throw new Error(JSON.stringify(data));
            }
            throw err;
        }
    }

    async download(url) {
        const { data, status } = await axios({ url, responseType: 'arraybuffer' });
        if (status === 200) {
            return data;
        }
        throw new Error(data);
    }

    async getFilesFromDirectory() {
        // TODO: 进行遍历层数的可配置项
        const filteredFiles = [];
        await new Promise(resolve => {
            fs.readdir(this.options.from, async (err, files) => {
                files.forEach(file => {
                    const filename = `${this.options.from}/${file}`;
                    const fileStat = fs.statSync(filename);
                    if (fileStat.isDirectory()) {
                        const subDirFiles = fs.readdirSync(filename);
                        subDirFiles.forEach(subDirFile => {
                            const subDirFileName = `${filename}/${subDirFile}`;
                            const subDirFileStat = fs.statSync(subDirFileName);
                            if (subDirFileStat.isFile()) {
                                filteredFiles.push(subDirFileName);
                            }
                        });
                    } else if (fileStat.isFile()) {
                        filteredFiles.push(filename);
                    }
                });
                resolve();
            });
        });
        return filteredFiles;
    }
}
module.exports = TinypngPlugin;
