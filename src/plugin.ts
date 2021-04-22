import Tweakpane from 'tweakpane';
import {StringInputParams} from 'tweakpane/lib/blade/common/api/types';
import {BindingTarget} from 'tweakpane/lib/common/binding/target';
import {CompositeConstraint} from 'tweakpane/lib/common/constraint/composite';
import {ValueMap} from 'tweakpane/lib/common/model/value-map';
import {createListConstraint} from 'tweakpane/lib/common/util';
import {InputBindingPlugin} from 'tweakpane/lib/input-binding/plugin';

import {PluginController} from './controller';
import {Option, SearchListParams} from './type';

{
	// NOTE: You can see JSDoc comments of `InputBindingPlugin` for details about each property
	//
	// `InputBindingPlugin<In, Ex>` means...
	// - The plugin receives the bound value as `Ex`,
	// - converts `Ex` into `In` and holds it
	//
	const plugin: InputBindingPlugin<string, string> = {
		id: 'search-list',

		// This plugin template injects a compiled CSS by @rollup/plugin-replace
		// See rollup.config.js for details
		css: '__css__',

		accept(exValue: unknown, params) {
			if (params.view !== 'search-list') return null;
			return typeof exValue === 'string' ? exValue : null;
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
				const c = createListConstraint<string>(args.params);
				if (c) {
					constraints.push(c);
				}
				// Use `CompositeConstraint` to combine multiple constraints
				return new CompositeConstraint<string>(constraints);
			},

			equals: (inValue1: string, inValue2: string) => {
				// Simply use `===` to compare primitive values,
				// or a custom comparator for complex objects
				return inValue1 === inValue2;
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
			const params = args.params as SearchListParams;
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
				options,
				noDataText: params.noDataText || 'no data',
				debounceDelay: params.debounceDelay || 250,
				textProps: new ValueMap({formatter: (val: any) => String(val)}),
				viewProps: args.viewProps,
			});
		},
	};

	// Register the plugin to Tweakpane
	Tweakpane.registerPlugin({
		// type: The plugin type.
		// - 'input': Input binding
		// - 'monitor': Monitor binding
		type: 'input',

		// plugin: Configurations of the plugin.
		plugin: plugin,
	});
}
