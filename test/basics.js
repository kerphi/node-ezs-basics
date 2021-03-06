const assert = require('assert');
const from = require('from');
const ezs = require('ezs');

ezs.use(require('../lib'));

describe('test', () => {
    it('CSVObject #1', (done) => {
        const res = [];
        from([
            ['a', 'b', 'c'],
            [1, 2, 3],
            [4, 5, 6],
        ])
            .pipe(ezs('CSVObject'))
            .on('data', (chunk) => {
                assert(typeof chunk === 'object');
                res.push(chunk);
            })
            .on('end', () => {
                assert.equal(2, res.length);
                assert.equal(2, res[0].b);
                done();
            });
    });


    it('CSVParse #1', (done) => {
        const res = [];
        from([
            'a,b,c\n',
            'd,e,d\n',
        ])
            .pipe(ezs('CSVParse'))
            .on('data', (chunk) => {
                assert(typeof chunk === 'object');
                res.push(chunk);
            })
            .on('end', () => {
                assert.equal(2, res.length);
                done();
            });
    });

    it('JSONString #1', (done) => {
        from([
            {
                a: 1,
            },
            {
                b: 2,
            },
        ])
            .pipe(ezs('JSONString'))
            .on('data', (chunk) => {
                assert(typeof chunk === 'string');
            })
            .on('end', () => {
                done();
            });
    });
    it('JSONString #2', (done) => {
        let res = '';
        from([
            {
                a: 1,
            },
            {
                b: 2,
            },
        ])
            .pipe(ezs('JSONString', { wrap: false, indent: false }))
            .on('data', (chunk) => {
                res += chunk;
            })
            .on('end', () => {
                assert.strictEqual(res, '{"a":1},{"b":2}');
                done();
            });
    });
    it('BUFObject #1', (done) => {
        let res = Buffer.alloc(0);
        from([
            'A',
            'B',
            'C',
        ])
            .pipe(ezs('BUFObject'))
            .on('data', (chunk) => {
                assert(Buffer.isBuffer(chunk));
                const len = res.length + chunk.length;
                res = Buffer.concat([res, chunk], len);
            })
            .on('end', () => {
                assert.strictEqual(res.toString(), 'ABC');
                done();
            });
    });
    it('CSVObject #1', (done) => {
        from([
            ['A', 'B', 'C.C'],
            [1, 2, 3],
        ])
            .pipe(ezs('CSVObject'))
            .on('data', (chunk) => {
                assert(chunk.A);
                assert(chunk.B);
                assert(chunk.CC);
            })
            .on('end', () => {
                done();
            });
    });
    it('OBJStandardize t#1', (done) => {
        from([
            {
                a: 1,
                b: 2,
            },
            {
                b: 2,
                c: 3,
            },
            {
                a: 1,
                c: 3,
            },

        ])
            .pipe(ezs('OBJStandardize'))
            .on('data', (chunk) => {
                assert(typeof chunk === 'object');
                assert(chunk.a === 1 || chunk.a === '');
                assert(chunk.b === 2 || chunk.b === '');
                assert(chunk.c === 3 || chunk.c === '');
            })
            .on('end', () => {
                done();
            });
    });

    /*
    it('URLGet #1', (done) => {
        let c = 0;
        from([
            {
                a: 1,
                u: 'https://registry.npmjs.org/ezs',
            },
            {
                a: 2,
                u: 'https://registry.npmjs.org/ezs-basics',
            },
        ])
            .pipe(ezs('URLGet', {
                source: 'u',
                target: 'v',
            }))
            .on('data', (chunk) => {
                c += 1;
                if (c === 1) {
                    assert(chunk.v.name === 'ezs');
                }
                if (c === 2) {
                    assert(chunk.v.name === 'ezs-basics');
                }
            })
            .on('end', () => {
                done();
            });
    });
    */
});
