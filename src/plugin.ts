import Tweakpane from 'tweakpane';
import {
	InputParamsOptionDictionary,
	StringInputParams,
} from 'tweakpane/lib/api/types';
import {BindingTarget} from 'tweakpane/lib/plugin/common/binding/target';
import {CompositeConstraint} from 'tweakpane/lib/plugin/common/constraint/composite';
import {InputBindingPlugin} from 'tweakpane/lib/plugin/input-binding';
import {createListConstraint} from 'tweakpane/lib/plugin/util';

import {PluginController} from './controller';
import {Option} from './type';

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

		accept(exValue: unknown) {
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
				const c = createListConstraint(args.params, (val) => String(val));
				if (c) {
					constraints.push(c);
				}
				// Use `CompositeConstraint` to combine multiple constraints
				return new CompositeConstraint(constraints);
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
			const optionsFromParams = ((args.params as StringInputParams).options ||
				{}) as InputParamsOptionDictionary<string>;
			const options = Object.keys(optionsFromParams).map((key) => {
				return {label: key, value: optionsFromParams[key]} as Option<string>;
			});
			// Create a controller for the plugin
			return new PluginController(args.document, {
				value: args.value,
				options,
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
