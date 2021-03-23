import flip from '@popperjs/core/lib/modifiers/flip';
import {createPopper, Instance} from '@popperjs/core/lib/popper-lite';
import {Value} from 'tweakpane/lib/plugin/common/model/value';
import {ClassName} from 'tweakpane/lib/plugin/common/view/class-name';
import {View} from 'tweakpane/lib/plugin/common/view/view';
import {TextView} from 'tweakpane/lib/plugin/input-bindings/common/view/text';

import {Config, Option} from './type';

// Create a class name generator from the view name
const className = ClassName('search-list');

interface ViewConfig extends Omit<Config, 'debounceDelay'> {
	textView: TextView<string>;
	onTextInput: (e: Event) => void;
	onOptionClick: (option: Option<string>) => void;
}

// Custom view class should implement `ValueView` interface
export class PluginView implements View {
	public readonly doc: Document;
	public readonly element: HTMLElement;
	public readonly selectBox: HTMLDivElement;
	public readonly optionsUl: HTMLUListElement;
	public readonly popper: Instance;
	public readonly value: Value<string>;
	public textView: TextView<string>;
	private options: Option<string>[] = [];
	private noDataText: string;

	constructor(doc: Document, config: ViewConfig) {
		this.doc = doc;
		doc.addEventListener('click', this.onDocClick.bind(this));

		// Create a root element for the plugin
		this.element = doc.createElement('div');
		this.element.classList.add(className());

		this.value = config.value;
		this.options = config.options;
		this.noDataText = config.noDataText;
		// Handle 'change' event of the value
		this.value.emitter.on('change', this.onValueChange_.bind(this));

		this.textView = config.textView;
		this.textView.inputElement.addEventListener(
			'click',
			this.onTextInputClick.bind(this),
		);
		this.textView.inputElement.addEventListener('input', config.onTextInput);
		this.element.appendChild(this.textView.element);

		const arrowEl = doc.createElement('div');
		arrowEl.classList.add(className('m'));
		arrowEl.innerHTML = '<svg><path d="M5 7h6l-3 3 z"></path></svg>';
		this.element.appendChild(arrowEl);

		// select options area
		const selectOptionsBoxEl = doc.createElement('div');
		this.selectBox = selectOptionsBoxEl;
		selectOptionsBoxEl.classList.add(className('select-box'));

		const optionsUl = doc.createElement('ul');
		this.optionsUl = optionsUl;
		optionsUl.classList.add(className('options'));
		this.updateOptions(config.options);
		optionsUl.addEventListener('click', (e: MouseEvent) => {
			if (e.target && e.target instanceof HTMLLIElement) {
				const value = e.target.getAttribute('data-value');
				if (value !== null) {
					const option = config.options.find((o) => o.value === value);
					if (option) config.onOptionClick(option);
				}
			}
		});
		selectOptionsBoxEl.appendChild(optionsUl);

		this.popper = createPopper(this.textView.inputElement, this.selectBox, {
			placement: 'bottom-start',
			modifiers: [
				{
					...flip,
					options: {
						fallbackPlacements: ['top'],
					},
				},
			],
		});

		this.element.appendChild(selectOptionsBoxEl);

		// Apply the initial value
		this.update();
		this.textView.update();
	}

	onDispose(): void {
		this.popper.destroy();
	}

	private onDocClick(e: MouseEvent): void {
		if (e.target && e.target instanceof HTMLElement) {
			if (e.target.contains(this.element)) {
				this.hideSelectOptionsBox();
			}
		}
	}

	private onTextInputClick() {
		// reset options
		this.updateOptions(this.options);
		this.showSelectOptionsBox();
	}

	public showSelectOptionsBox(): void {
		this.selectBox.setAttribute('data-show', '');
		this.popper.update();
	}

	public hideSelectOptionsBox(): void {
		this.selectBox.removeAttribute('data-show');
	}

	public updateOptions(options: Option<string>[]): void {
		this.optionsUl.innerHTML = '';
		if (options.length === 0) {
			const noDataLi = this.doc.createElement('li');
			noDataLi.innerText = this.noDataText;
			noDataLi.classList.add('no-data');
			this.optionsUl.appendChild(noDataLi);
			return;
		}

		options.forEach((option) => {
			const optionEl = this.doc.createElement('li');
			optionEl.innerText = option.label;
			optionEl.setAttribute('data-value', option.value);
			this.optionsUl.appendChild(optionEl);
		});
	}

	// Use this method to apply the current value to the view
	public update(): void {
		const rawValue = this.value.rawValue;
		const option = this.options.find((o) => o.value === rawValue);
		if (option) {
			this.textView.value.rawValue = option.label;
		}
		this.hideSelectOptionsBox();
	}

	private onValueChange_() {
		this.update();
	}
}
