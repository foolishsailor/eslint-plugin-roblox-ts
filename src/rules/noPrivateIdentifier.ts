import ts, { isPrivateIdentifier, PrivateIdentifier } from "typescript";
import { getParserServices, makeRule } from "../util/rules";

export const noPrivateIdentifierName = "no-private-identifier";
export const noPrivateIdentifier = makeRule<[], "privateIdentifierViolation">({
	name: noPrivateIdentifierName,
	meta: {
		type: "problem",
		docs: {
			description: "Bans private identifiers from being used",
			category: "Possible Errors",
			recommended: "error",
			requiresTypeChecking: false,
		},
		fixable: "code",
		messages: {
			privateIdentifierViolation: "Private identifiers are not supported!",
		},
		schema: [],
	},
	defaultOptions: [],
	create(context) {
		const service = getParserServices(context);
		return {
			ClassProperty(node) {
				const tsNode = service.esTreeNodeToTSNodeMap.get(node.key);
				if (isPrivateIdentifier(tsNode)) {
					const PrivateIdentifierTsNode = tsNode as PrivateIdentifier;
					context.report({
						node: node,
						messageId: "privateIdentifierViolation",
						fix: fixer =>
							fixer.replaceText(
								node.key,
								`private ${PrivateIdentifierTsNode.escapedText.toString().substring(1)}`,
							),
					});
				}
			},
		};
	},
});
