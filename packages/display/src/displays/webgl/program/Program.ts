/*
 * Copyright (C) 2019-2021 HERE Europe B.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 * License-Filename: LICENSE
 */

import {createProgram} from '../glTools';
import {GLStates} from './GLStates';
// @ts-ignore
import introVertex from '../glsl/intro_vertex.glsl';

let UNDEF;

class Program {
    prog: WebGLProgram;

    gl: WebGLRenderingContext;

    name: string;

    private usage;

    protected glStates: GLStates;

    // protected attrLength: number = 0;
    // protected attributeSetters = {};

    attributes: { [name: string]: number } = {};
    uniforms: { [name: string]: WebGLUniformLocation } = {};
    protected uniformSetters = {};

    protected mode: number; // gl.POINTS;

    private createUniformSetter(uInfo: WebGLActiveInfo, location: WebGLUniformLocation) {
        const gl = this.gl;

        switch (uInfo.type) {
        case gl.FLOAT:
            return (v) => gl.uniform1f(location, v);

        case gl.FLOAT_MAT4:
            return (v) => gl.uniformMatrix4fv(location, false, v);

        case gl.FLOAT_VEC2:
            return (v) => gl.uniform2fv(location, v);

        case gl.FLOAT_VEC3:
            return (v) => gl.uniform3fv(location, v);

        case gl.FLOAT_VEC4:
            return (v) => gl.uniform4fv(location, v);

        case gl.BOOL:
        case gl.SAMPLER_2D:
            return (v) => gl.uniform1i(location, v);
        }

        return () => console.warn('setting uniform not supported', uInfo, location);
    }

    private macros: string[] = [
        '#define M_PI 3.1415927410125732'
    ];

    constructor(gl: WebGLRenderingContext, mode: number, vertexShader: string, fragmentShader: string, devicePixelRation: number) {
        const render = this;
        const macros = render.macros.concat(`#define DEVICE_PIXEL_RATIO ${devicePixelRation.toFixed(1)}\n`).join('\n');

        const glProg = createProgram(gl,
            macros + introVertex + vertexShader,
            macros + fragmentShader
        );

        this.mode = mode;
        this.usage = gl.STATIC_DRAW;
        this.gl = gl;
        this.prog = glProg;

        this.glStates = new GLStates({scissor: true, blend: false, depth: true});

        // if (attributes) {
        //
        //     const aLength = attributes.length;
        //     for (let a = 0; a < aLength; a++) {
        //         render.attributes[attributes[a]] = gl.getAttribLocation(glProg, attributes[a]);
        //     }
        //     render.attrLength = aLength;
        // }

        // setup attributes
        let activeAttributes = gl.getProgramParameter(glProg, gl.ACTIVE_ATTRIBUTES);
        for (let a = 0; a < activeAttributes; ++a) {
            let aInfo = gl.getActiveAttrib(glProg, a);
            const name = aInfo.name;
            this.attributes[name] = gl.getAttribLocation(glProg, name);
            // attributeSetters[name] = this.createUniformSetter(uInfo, location);
        }

        // setup uniforms
        let activeUniforms = gl.getProgramParameter(glProg, gl.ACTIVE_UNIFORMS);

        for (let u = 0; u < activeUniforms; u++) {
            const uInfo = gl.getActiveUniform(glProg, u);
            const name = uInfo.name;
            const location = gl.getUniformLocation(glProg, name);

            render.uniforms[name] = location;

            // gl.getUniformLocation(program, uniformInfo.name);
            this.uniformSetters[uInfo.name] = this.createUniformSetter(uInfo, location);
        }
    }

    getUniformLocation(name: string): WebGLUniformLocation {
        return this.uniforms[name];
    }

    setUniform(name: string, data: any) {
        let uset;
        if (uset = this.uniformSetters[name]) {
            uset(data);
        }
    }

    initUniforms(uniforms) {
        for (var name in uniforms) {
            let setter = this.uniformSetters[name];
            if (setter) {
                setter(uniforms[name]);
            } else {
                // console.warn('no uniform setter defined', name);
            }
        }
    }

    initAttributes(attributes, buffers) {
        const gl = this.gl;
        let attr;
        let position;


        for (let name in attributes) {
            attr = attributes[name];
            position = this.attributes[name];

            if (position == UNDEF) {
                console.warn(this.name, ': attribute', name, 'not found');
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.get(attr));
            // gl.bindBuffer(gl.ARRAY_BUFFER, buffers[name]);


            // gl.vertexAttribPointer(position, attr.size, attr.type, attr.normalized, 0, 0);

            gl.vertexAttribPointer(position, attr.size, attr.type, attr.normalized, attr.stride, attr.offset);

            // Turns on the vertex attributes in the GPU program.
            gl.enableVertexAttribArray(position); // active buffer!
        }
    }

    initIndex(index, buffers) {
        const gl = this.gl;
        let indexBuffer = buffers.get(index);
        let ready = true;

        if (!indexBuffer) {
            indexBuffer = gl.createBuffer();
            buffers.set(index, indexBuffer);
            ready = false;
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        if (!ready) {
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, index.data, gl.STATIC_DRAW);
        } else {
            delete index.data;
        }
    }

    pass(pass: string) {
        // draw in opaque pass only by default.
        return pass == 'opaque';
    }

    draw(group, buffers) {
        const gl = this.gl;
        const {index, texture} = group;
        const mode = group.mode || this.mode;

        // console.log(
        //     this.name,
        //     'DEPTH_TEST', gl.getParameter(gl.DEPTH_TEST),
        //     'SCISSOR_TEST', gl.getParameter(gl.SCISSOR_TEST),
        //     'STENCIL_TEST', gl.getParameter(gl.STENCIL_TEST),
        //     'BLEND', gl.getParameter(gl.BLEND)
        // );

        if (texture) {
            gl.activeTexture(gl.TEXTURE0);
            texture.bind();
        }
        if (index) {
            this.initIndex(index, buffers);
            gl.drawElements(mode, index.length, index.type, 0);
        } else {
            gl.drawArrays(mode, group.arrays.first, group.arrays.count);
        }
    };

    private setStates(scissor: boolean, blend: boolean, depth: boolean, stencil: boolean) {
        const gl = this.gl;
        // apply default gl-states
        if (scissor) {
            gl.enable(gl.SCISSOR_TEST);
        } else {
            gl.disable(gl.SCISSOR_TEST);
        }

        if (stencil) {
            gl.enable(gl.STENCIL_TEST);
        } else {
            gl.disable(gl.STENCIL_TEST);
        }

        if (blend) {
            gl.enable(gl.BLEND);
        } else {
            gl.disable(gl.BLEND);
        }

        if (depth) {
            gl.enable(gl.DEPTH_TEST);
        } else {
            gl.disable(gl.DEPTH_TEST);
        }
    }

    init(options: GLStates, pass: 'alpha' | 'opaque', stencil: boolean) {
        const prog = this;
        const {gl} = prog;
        const opaquePass = pass == 'opaque';
        let {blend, scissor, depth} = this.glStates;

        // overwrite with custom gl-states
        if (options.scissor != UNDEF) {
            scissor = options.scissor;
        }
        if (options.blend != UNDEF) {
            blend = options.blend;
        }
        if (options.depth != UNDEF) {
            depth = options.depth;
        }
        prog.setStates(scissor, blend, depth, stencil && !opaquePass && blend && scissor);

        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        // get rid of zfighting for alpha pass.
        // alpha pass is drawn ordered zindex -> no need to write to depthbuffer
        gl.depthMask(opaquePass);
    }

    // use() {
    //     const gl = this.gl;
    //     gl.useProgram(this.prog);
    //     // this.init(options);
    // }
};

export default Program;
