// Type definitions for cli-table 0.3.1
// Project: https://github.com/Automattic/cli-table
// Definitions by: Nick Lee <https://github.com/nickplee/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare module "cli-table" {
	
	interface TableConfig {
		head: Array<string>;
	}
	
	class Table {
		constructor(options: TableConfig);
		push(...args: Array<any>): void;
		toString(): string;
	}

	export = Table;
	
}