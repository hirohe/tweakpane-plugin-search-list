import {Controller, TextView, Value, ViewProps} from '@tweakpane/core';
import debounce from 'lodash.debounce';

import {Option, PluginConfig} from './types';
import {PluginView} from './view';

// Custom controller class should implement `Controller` interface
export class PluginController implements Controller<PluginView> {
	public readonly value: Value<string>;
	public readonly textValue: Value<string>;
	public readonly options: Option<string>[];
	public readonly debounceFilterOptions: ReturnType<typeof debounce>;
	public readonly view: PluginView;
	public readonly viewProps: ViewProps;

	constructor(doc: Document, config: PluginConfig) {
		this.value = config.value;
		this.textValue = config.textValue;
		this.options = config.options;
		this.viewProps = config.viewProps;

		this.debounceFilterOptions = debounce(
			this.filterOptions,
			config.debounceDelay,
		);

		const selectedOption = config.options.find(
			(o) => o.value === config.value.rawValue,
		);
		if (selectedOption) {
			this.textValue.rawValue = selectedOption.label;
		}

		const textView = new TextView<string>(doc, {
			props: config.textProps,
			viewProps: config.viewProps,
			value: this.textValue,
		});

		// Create a custom view
		this.view = new PluginView(doc, {
			textProps: config.textProps,
			viewProps: config.viewProps,
			textView,
			value: this.value,
			options: config.options,
			noDataText: config.noDataText,
			onTextInput: this.onTextInput.bind(this),
			onOptionClick: this.onOptionClick.bind(this),
		});

		config.viewProps.handleDispose(() => {
			// cancel debounce action
			this.debounceFilterOptions.cancel();
		});
	}

	filterOptions(text = ''): void {
		const options = this.options.filter(
			(o) => o.label.toLowerCase().indexOf(text.trim().toLowerCase()) !== -1,
		);
		options && this.view.updateOptions(options);
	}

	private onTextInput(e: Event): void {
		const inputEl = e.currentTarget as HTMLInputElement;
		const value = inputEl.value;
		this.debounceFilterOptions(value);
	}

	private onOptionClick(option: Option<string>) {
		this.value.rawValue = option.value;
		this.textValue.rawValue = option.label;
	}
}
