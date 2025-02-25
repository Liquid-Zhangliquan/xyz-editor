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

// @ts-ignore
import vertexShader from '../glsl/extrude_vertex.glsl';
// @ts-ignore
import fragmentShader from '../glsl/extrude_fragment.glsl';

import {JSUtils} from '@here/xyz-maps-common';
import Program from './Program';
import {GLStates} from './GLStates';


class ExtrudeProgram extends Program {
    name = 'Extrude';

    glStates = new GLStates({
        scissor: false,
        blend: false,
        depth: true
    });


    constructor(gl: WebGLRenderingContext, devicePixelRation: number) {
        super(gl, gl.TRIANGLES, vertexShader, fragmentShader, devicePixelRation);
    }

    init(options: GLStates, pass, stencil: boolean) {
        const {gl} = this;
        super.init(options, pass, stencil);
        // extrudes always need depth testing (alpha pass)
        gl.depthMask(true);
    }
}

export default ExtrudeProgram;
