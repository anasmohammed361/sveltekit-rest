import { initSveltekitRest } from '../src/lib/index.js';
import { describe, expect, test } from "vitest";
import { z } from "zod";

describe('HTTP Methods Inputs',()=>{
    describe('get',()=>{
        const t = initSveltekitRest.create();
        test('without Inputs',()=>{
            //@ts-ignore
            t.get(({input})=>{
                    expect(input).toBe(undefined)
            })
        })
        test('With Inputs',()=>{
            const zodObj = z.object({
                name:z.string()
            })
            t.input(zodObj).get(({input})=>{
                    //@ts-ignore
                     expect(input).toBeTypeOf(zodObj._type);
            })
        })
    })
    describe('get',()=>{
        const t = initSveltekitRest.create();
        test('without Inputs',()=>{
              //@ts-ignore
            t.get(({input})=>{
                    expect(input).toBe(undefined)
            })
        })
        test('With Inputs',()=>{
            const zodObj = z.object({
                name:z.string()
            })
            t.input(zodObj).get(({input})=>{
                    //@ts-ignore
                     expect(input).toBeTypeOf(zodObj._type);
            })
        })
    })
    describe('post',()=>{
        const t = initSveltekitRest.create();
        test('without Inputs',()=>{
            //@ts-ignore
            t.post(({input})=>{
                    expect(input).toBe(undefined)
            })
        })
        test('With Inputs',()=>{
            const zodObj = z.object({
                name:z.string()
            })
            t.input(zodObj).post(({input})=>{
                    //@ts-ignore
                     expect(input).toBeTypeOf(zodObj._type);
            })
        })
    })
    describe('put',()=>{
        const t = initSveltekitRest.create();
        test('without Inputs',()=>{
              //@ts-ignore
            t.put(({input})=>{
                    expect(input).toBe(undefined)
            })
        })
        test('With Inputs',()=>{
            const zodObj = z.object({
                name:z.string()
            })
            t.input(zodObj).put(({input})=>{
                    //@ts-ignore
                     expect(input).toBeTypeOf(zodObj._type);
            })
        })
    })
    describe('delete',()=>{
        const t = initSveltekitRest.create();
        test('without Inputs',()=>{
              //@ts-ignore
            t.delete(({input})=>{
                    expect(input).toBe(undefined)
            })
        })
        test('With Inputs',()=>{
            const zodObj = z.object({
                name:z.string()
            })
            t.input(zodObj).delete(({input})=>{
                    //@ts-ignore
                     expect(input).toBeTypeOf(zodObj._type);
            })
        })
    })
})