const mdlinks = require('../cli.js');
const options = {
    stats: false,
    validate: false
};
test('deberia retornar un arreglo de objetos (solo path)', () => {
    
    return mdlinks('read.md', options)
    .then((res) => {
       expect(res).toEqual([
           {
               href: 'http://community.laboratoria.la/t/modulos75',
               text: 'Módulos, librerías, paquetes, frameworks... ¿cuál es la diferencia?',
               file: 'C:\\Users\\usuario\\Documents\\reto-track\\lim20181-Track-FE-markdown-list\\read.md',
            },
            {
               href: 'https://nodejs.org/docs/latest-v0.10.x/api/modules.html',
               text: 'Módulos(CommonJS)',
               file: 'C:\\Users\\usuario\\Documents\\reto-track\\lim20181-Track-FE-markdown-list\\read.md',
            },
            {
                href: 'https://semver.org/',
                text: 'Semver',
                file: 'C:\\Users\\usuario\\Documents\\reto-track\\lim20181-Track-FE-markdown-list\\read.md',
             }
       ])
    })
})
test('deberia retornar total y unicos (con validate)', () => {
    options.validate= true;
    return mdlinks('read.md', options).then((res) => {
      expect(res).toEqual(
          [{   "href": "http://community.laboratoria.la/t/modulos75", 
               "status": 400, 
               "statusText": "FAIL"
            }, 
            {  "href": "https://nodejs.org/docs/latest-v0.10.x/api/modules.html", 
               "status": 200, 
               "statusText": "OK"
            }, 
            {  "href": "https://semver.org/",
               "status": 200,
               "statusText": "OK"
            }]
        );
    });
});
test('deberia retornar total y unicos (con stats)', () => {
    options.stats= true;
    options.validate=false;
    return mdlinks('read.md', options).then((res) => {
      expect(res).toEqual({ total: 3, unique: 3 });
    });
});
test('deberia retornar total,unicos y rotos (con validate y stats)', () => {
    options.validate=true;
    options.stats=true;
    
    return mdlinks('read.md', options).then((res) => {
      expect(res).toEqual({ total: 3, unique: 3, broken: 1});
    });
});

test('deberia retornar un arreglo de objetos (solo path)', () => {
    options.stats=false;
    options.validate=false;
    return mdlinks('directory', options)
    .then((res) => {
       expect(res).toEqual(
           [{  "href": "https://nodejs.org/api/fsjkhjkhkhtml", 
               "text": "File System"
            }, 
            {  "href": "http://community.laboratoria.la/t/modulos75", 
               "text": "Módulos, librerías, paquetes, frameworks... ¿cuál es la diferencia?"
            }, 
            {  "href": "https://nodejs.org/docs/latest-v0.10.x/api/modules.html", 
               "text": "Módulos(CommonJS)"
            }]
        )
    })
})
test('deberia retornar total y unicos (con validate)', () => {
    options.validate= true;
    return mdlinks('directory', options).then((res) => {
      expect(res).toEqual(
          [{ "href": "https://nodejs.org/api/fsjkhjkhkhtml", 
             "status": 400, 
             "statusText": "FAIL"
           }, 
           {  "href": "http://community.laboratoria.la/t/modulos75", 
              "status": 400, 
              "statusText": "FAIL"
           }, 
           {  "href": "https://nodejs.org/docs/latest-v0.10.x/api/modules.html", 
              "status": 200, 
              "statusText": "OK"
           }]
        );
    });
});
test('deberia retornar total y unicos (con stats)', () => {
    options.stats= true;
    options.validate=false;
    return mdlinks('directory', options).then((res) => {
      expect(res).toEqual({ total: 3, unique: 3 });
    });
});
test('deberia retornar total,unicos y rotos (con validate y stats)', () => {
    options.validate=true;
    options.stats=true;
    
    return mdlinks('directory', options).then((res) => {
      expect(res).toEqual({ total: 3, unique: 3, broken: 2});
    });
});
test('deberia retornar total,unicos y rotos (con validate y stats)', () => {
    options.validate=true;
    options.stats=true;
    
    return mdlinks('directory', options).then((res) => {
      expect(res).toEqual({ total: 3, unique: 3, broken: 2});
    });
});

