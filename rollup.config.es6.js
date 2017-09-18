import babel from 'rollup-plugin-babel';
export default {
    entry:"src/cf_form.js",
    dest:"dest/cf_form.es6.js",
    format:"es",
    external:[
        "react",
        "react-dom"
    ],
    plugins: [
        babel({
            exclude: 'node_modules/**',
            babelrc: false,
            "presets":[
                { 
                    "env": {
                        "modules": false
                    } 
                },
                "react"
            ],
            "plugins": [
                ["transform-object-rest-spread", { "useBuiltIns": true },"external-helpers"]
            ]
        })        
    ]
}