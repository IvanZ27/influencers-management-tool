export default {
	extends: ["stylelint-config-standard"],
	plugins: ["stylelint-order"],
	rules: {
		"selector-class-pattern": [
			"^[a-z0-9]+(?:-[a-z0-9]+)*(?:__(?:[a-z0-9]+(?:-[a-z0-9]+)*))?(?:--(?:[a-z0-9]+(?:-[a-z0-9]+)*))?$",
			{
				message: "Expected class selector to be kebab-case or BEM (block__element--modifier)",
			},
		],
		"order/properties-alphabetical-order": true,
	},
};
