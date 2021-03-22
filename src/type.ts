import {Value} from 'tweakpane/lib/plugin/common/model/value';

export interface Option<Value> {
	label: string;
	value: Value;
}

export interface Config {
	value: Value<string>;
	options: Option<string>[];
}
