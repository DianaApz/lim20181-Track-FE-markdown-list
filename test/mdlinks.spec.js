const mdlinks = require('../mdlinks.js');
const options = {};
const path = require('path');
test('Para archivos debería retornar un arreglo de objetos (solo path)', () => {
    options.validate = false;
    options.stats = false;
    return mdlinks('read.md', options)
        .then((res) => {
            expect(res).toEqual(
                [{
                    href: 'http://community.laboratoria.la/t/modulos75',
                    text: 'Módulos, librerías, paquetes, frameworks... ¿cuál es la diferencia?',
                    file: path.resolve('read.md')
                },
                {
                    href: 'https://nodejs.org/docs/latest-v0.10.x/api/modules.html',
                    text: 'Módulos(CommonJS)',
                    file: path.resolve('read.md')
                }
                ]
            )
        })
})
test('Para archivos debería retornar un arreglo de objeto (solo validate)', () => {
    options.validate = true;
    options.stats = false;
    return mdlinks('read.md', options)
        .then((res) => {
            expect(res).toEqual(
                [{
                    "href": "http://community.laboratoria.la/t/modulos75",
                    "status": 400,
                    "statusText": "FAIL"
                },
                {
                    "href": "https://nodejs.org/docs/latest-v0.10.x/api/modules.html",
                    "status": 200,
                    "statusText": "OK"
                }]
            );
        });
});
test('Para archivos debería retornar un objeto (solo stats)', () => {
    options.stats = true;
    options.validate = false;
    return mdlinks('read.md', options)
        .then((res) => {
            expect(res).toEqual({ total: 2, unique: 2 });
        });
});
test('Para archivos debería retornar un objeto (validate y stats)', () => {
    options.validate = true;
    options.stats = true;

    return mdlinks('read.md', options)
        .then((res) => {
            expect(res).toEqual({ total: 2, unique: 2, broken: 1 });
        });
});

test('Para carpeta debería retornar un arreglo de objetos (solo path)', () => {
    options.stats = false;
    options.validate = false;
    return mdlinks('directory', options)
        .then((res) => {
            expect(res).toEqual(
                [{
                    "href": "https://nodejs.org/api/fsjkhjkhkhtml",
                    "text": "File System"
                },
                {
                    "href": "http://community.laboratoria.la/t/modulos75",
                    "text": "Módulos, librerías, paquetes, frameworks... ¿cuál es la diferencia?"
                },
                {
                    "href": "https://nodejs.org/docs/latest-v0.10.x/api/modules.html",
                    "text": "Módulos(CommonJS)"
                }]
            )
        })
})
test('Para carpeta debería retornar un objeto (solo validate)', () => {
    options.validate = true;
    options.stats = false;
    return mdlinks('directory', options)
        .then((res) => {
            expect(res).toEqual(
                [{
                    "href": "https://nodejs.org/api/fsjkhjkhkhtml",
                    "status": 400,
                    "statusText": "FAIL"
                },
                {
                    "href": "http://community.laboratoria.la/t/modulos75",
                    "status": 400,
                    "statusText": "FAIL"
                },
                {
                    "href": "https://nodejs.org/docs/latest-v0.10.x/api/modules.html",
                    "status": 200,
                    "statusText": "OK"
                }]
            );
        });
});
test('Para carpeta debería retornar un objeto con las sgts propiedades total y únicos (solo stats)', () => {
    options.stats = true;
    options.validate = false;
    return mdlinks('directory', options)
        .then((res) => {
            expect(res).toEqual({ total: 3, unique: 3 });
        });
});
test('Para carpeta debería retornar un objeto con las sgts propiedades total,unicos y rotos (validate y stats)', () => {
    options.validate = true;
    options.stats = true;

    return mdlinks('directory', options)
        .then((res) => {
            expect(res).toEqual({ total: 3, unique: 3, broken: 2 });
        });
});


