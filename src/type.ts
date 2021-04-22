import {StringInputParams} from 'tweakpane/lib/blade/common/api/types';
import {Value} from 'tweakpane/lib/common/model/value';
import {ViewProps} from 'tweakpane/lib/common/model/view-props';
import {TextProps} from 'tweakpane/lib/common/view/text';

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
	textProps: TextProps<string>;
	viewProps: ViewProps;
}
