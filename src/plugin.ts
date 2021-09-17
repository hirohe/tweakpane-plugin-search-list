import {
	BindingTarget,
	CompositeConstraint,
	createListConstraint,
	createValue,
	InputBindingPlugin,
	StringInputParams,
	ValueMap,
} from '@tweakpane/core';

import {PluginController} from './controller';
import {Option} from './types';

interface PluginInputParams extends StringInputParams {
	noDataText?: string;
	debounceDelay?: number;
}

// NOTE: You can see JSDoc comments of `InputBindingPlugin` for details about each property
//
// `InputBindingPlugin<In, Ex, P>` means...
// - The plugin receives the bound value as `Ex`,
// - converts `Ex` into `In` and holds it
// - P is the type of the parsed parameters
//
export const TemplateInputPlugin: InputBindingPlugin<
	string,
	string,
	PluginInputParams
> = {
	id: 'input-template',

	// type: The plugin type.
	// - 'input': Input binding
	// - 'monitor': Monitor binding
	type: 'input',

	// This plugin template injects a compiled CSS by @rollup/plugin-replace
	// See rollup.config.js for details
	css: '__css__',

	accept(exValue: unknown, params: Record<string, unknown>) {
		if (params.view !== 'search-list' && typeof exValue !== 'string')
			return null;

		// Return a typed value and params to accept the user input
		return {
			initialValue: exValue as string,
			params,
		};
	},

	binding: {
		reader(_args) {
			return (exValue: unknown): string => {
				// Convert an external unknown value into the internal value
				return typeof exValue === 'string' ? exValue : '';
			};
		},

		constraint(args) {
			// Create a value constraint from the user input
			const constraints = [];
			// You can reuse existing functions of the default plugins
			const cr = createListConstraint<string>(args.params.options);
			if (cr) {
				constraints.push(cr);
			}
			return new CompositeConstraint<string>(constraints);
		},

		writer(_args) {
			return (target: BindingTarget, inValue) => {
				// Use `target.write()` to write the primitive value to the target,
				// or `target.writeProperty()` to write a property of the target
				target.write(inValue);
			};
		},
	},

	controller(args) {
		const params = args.params as PluginInputParams;
		const optionsFromParams = (params.options || {}) as StringInputParams;
		const options = Object.keys(optionsFromParams).map((key) => {
			return {
				label: key,
				value: optionsFromParams[key as keyof StringInputParams],
			} as Option<string>;
		});
		// Create a controller for the plugin
		return new PluginController(args.document, {
			value: args.value,
			textValue: createValue(''),
			options,
			noDataText: params.noDataText || 'no data',
			debounceDelay: params.debounceDelay || 250,
			textProps: ValueMap.fromObject({
				formatter: (val: any) => String(val),
			}),
			viewProps: args.viewProps,
		});
	},
};
