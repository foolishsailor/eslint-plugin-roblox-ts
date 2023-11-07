import { TSESTree } from "@typescript-eslint/experimental-utils";
import ts from "typescript";
import { getParserServices, makeRule } from "../util/rules";
import { getType, isArrayType } from "../util/types";

export const noArrayLengthName = "no-array-length";
export const noArrayLength = makeRule<[], "arrayLengthViolation">({
  name: noArrayLengthName,
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforces the use of `.size()` instead of `.length` on arrays",
      recommended: "warn",
      requiresTypeChecking: true,
    },
    messages: {
      arrayLengthViolation: "Use `.size()` instead of `.length` on arrays.",
    },
    schema: [],
    fixable: "code",
  },
  defaultOptions: [],
  create(context) {
    const service = getParserServices(context);
    const checker = service.program.getTypeChecker();

    return {
      MemberExpression(node: TSESTree.MemberExpression) {
   
        if (node.property.type === TSESTree.AST_NODE_TYPES.Identifier && node.property.name === "length") {
          const tsNode = service.esTreeNodeToTSNodeMap.get(node.object) as ts.Node;
          const type = getType(checker, tsNode);

          if (isArrayType(checker, type)) {
            context.report({
              node: node.property,
              messageId: "arrayLengthViolation",
              fix(fixer) {
       
                return fixer.replaceText(node.property, 'size()');
              }
            });
          }
        }
      },
    };
  },
});
