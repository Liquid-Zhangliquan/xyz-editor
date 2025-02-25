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

import {Attribute} from '../Attribute';
import {FlexArray} from './FlexArray';

export type FlexAttribute = {
    data: FlexArray;
    size: number;
    normalized?: boolean;
    stride?: number;
    offset?: number;
}

export class TemplateBuffer {
    scissor: boolean;

    first: number;
    last: number;

    attributes: { [name: string]: FlexAttribute };
    groups: {
        attributes: { [name: string]: FlexAttribute; }
    }

    i32: boolean = false;

    private _index?: number[];

    protected _flat: boolean = true;

    constructor(scissor: boolean) {
        this.scissor = scissor;
    }

    count(): number {
        const aPosition = this.attributes.a_position;
        return aPosition.data.length / aPosition.size - this.first;
    }

    index(): number[] {
        return this._index = this._index || [];
    }

    hasIndex(): boolean {
        return !!this._index;
    }

    isEmpty(): boolean {
        return this.count() == 0;
    }

    trimAttribute(flexAttr: FlexAttribute): Attribute {
        const attr = <any>flexAttr;
        attr.data = attr.data.trim();
        return attr;
    }

    isFlat() {
        return this._flat;
    }
}
