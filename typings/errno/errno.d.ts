// Type definitions for errno 0.1.2
// Project: https://github.com/rvagg/node-errno
// Definitions by: Nick Lee <http://github.com/nickplee>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare module "errno" {
	export interface IError {
		errno: number
		code: string
		description: string
	}
	export let errno: Array<IError>
	export let code: Dictionary<IError>
}