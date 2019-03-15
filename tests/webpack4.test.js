import fs from 'fs-extra';
import path from 'path';
const TinypngPlugin = require('../index');

const WEBPACK_CONFIG_PATH = 'webpack4';

const webpack = require('./' + WEBPACK_CONFIG_PATH + '/node_modules/webpack');
const options = require('./' + WEBPACK_CONFIG_PATH + '/webpack.config.js');

beforeAll(done => {
    jest.setTimeout(1000000);
    try {
        fs.removeSync(path.resolve(__dirname, `./${WEBPACK_CONFIG_PATH}/assets/`));
        fs.copySync(
            path.resolve(__dirname, './assets/'),
            path.resolve(__dirname, `./${WEBPACK_CONFIG_PATH}/assets/`),
        );
    } catch (err) {
        console.error(err);
    }
    webpack(options, (err, stats) => {
        if (err) console.log(err);
        if (stats.hasErrors()) console.log(stats.toString());
        done();
    });
});
describe('Test on webpack4', () => {
    let dictStats;
    describe('first time output', () => {
        test('should have dict', () => {
            const isDictExist = fs.existsSync(
                path.resolve(__dirname, `./${WEBPACK_CONFIG_PATH}/assets/.dict`),
            );
            expect(isDictExist).toBe(true);
        });
        test('should have images', () => {
            dictStats = fs.statSync(
                path.resolve(__dirname, `./${WEBPACK_CONFIG_PATH}/assets/.dict`),
            );
            const dict = fs.readJSONSync(
                path.resolve(__dirname, `./${WEBPACK_CONFIG_PATH}/assets/.dict`),
            );
            let isImageExist = true;
            dict.forEach(el => {
                if (
                    !fs.existsSync(
                        path.resolve(__dirname, `./${WEBPACK_CONFIG_PATH}${el.filePath}`),
                    )
                ) {
                    isImageExist = false;
                }
            });
            expect(isImageExist).toBe(true);
        });
    });
    describe('second time output', () => {
        test('should not change dict', done => {
            webpack(
                {
                    ...options,
                    plugins: [
                        new TinypngPlugin({
                            disable: false,
                            from: path.resolve(__dirname, `./${WEBPACK_CONFIG_PATH}/assets`),
                            projectRoot: path.resolve(__dirname, `./${WEBPACK_CONFIG_PATH}`),
                            extentions: ['png', 'jpeg', 'jpg'],
                            silent: true,
                            cache: true,
                            cacheLocation: path.resolve(
                                __dirname,
                                `./${WEBPACK_CONFIG_PATH}/assets/.dict`,
                            ),
                        }),
                    ],
                },
                (err, stats) => {
                    if (err) console.log(err);
                    if (stats.hasErrors()) console.log(stats.toString());

                    const newDictStats = fs.statSync(
                        path.resolve(__dirname, `./${WEBPACK_CONFIG_PATH}/assets/.dict`),
                    );
                    expect(dictStats.mtimeMs).toEqual(newDictStats.mtimeMs);
                    done();
                },
            );
        });
    });
});
