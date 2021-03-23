import debounce from 'lodash/debounce';
import {ValueController} from 'tweakpane/lib/plugin/common/controller/value';
import {Value} from 'tweakpane/lib/plugin/common/model/value';
import {TextView} from 'tweakpane/lib/plugin/input-bindings/common/view/text';

import {Config, Option} from './type';
import {PluginView} from './view';

// Custom controller class should implement `ValueController` interface
export class PluginController implements ValueController<string> {
	public readonly value: Value<string>;
	public readonly textValue: Value<string>;
	public readonly view: PluginView;
	public readonly options: Option<string>[];
	public debounceFilterOptions: ReturnType<typeof debounce>;

	constructor(doc: Document, config: Config) {
		this.value = config.value;
		this.textValue = new Value<string>('');
		this.options = config.options;

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

		const textView = new TextView(doc, {
			formatter: (val) => String(val),
			value: this.textValue,
		});

		// Create a custom view
		this.view = new PluginView(doc, {
			textView,
			value: this.value,
			options: config.options,
			noDataText: config.noDataText,
			onTextInput: this.onTextInput.bind(this),
			onOptionClick: this.onOptionClick.bind(this),
		});
	}

	onDispose(): void {
		// cancel debounce action
		this.debounceFilterOptions.cancel();
	}

	filterOptions(text = ''): void {
		const options = this.options.filter(
			(o) => o.label.indexOf(text.trim()) !== -1,
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
