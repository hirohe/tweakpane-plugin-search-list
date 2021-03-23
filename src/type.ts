import {StringInputParams} from 'tweakpane/lib/api/types';
import {Value} from 'tweakpane/lib/plugin/common/model/value';

export interface SearchListParams extends StringInputParams {
	noDataText?: string;
	debounceDelay?: number;
}

export interface Option<Value> {
	label: string;
	value: Value;
}

export interface Config {
	value: Value<string>;
	options: Option<string>[];
	noDataText: string;
	debounceDelay: number;
}
