"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noArrayLength = exports.noArrayLengthName = void 0;
const experimental_utils_1 = require("@typescript-eslint/experimental-utils");
const rules_1 = require("../util/rules");
const types_1 = require("../util/types");
exports.noArrayLengthName = 'no-array-length';
exports.noArrayLength = (0, rules_1.makeRule)({
    name: exports.noArrayLengthName,
    meta: {
        type: 'problem',
        docs: {
            description: 'Enforces the use of `.size()` instead of `.length` on arrays',
            recommended: 'error',
            requiresTypeChecking: true
        },
        messages: {
            arrayLengthViolation: 'Use `.size()` instead of `.length` on arrays.'
        },
        schema: [],
        fixable: 'code'
    },
    defaultOptions: [],
    create(context) {
        const service = (0, rules_1.getParserServices)(context);
        const checker = service.program.getTypeChecker();
        return {
            MemberExpression(node) {
                if (node.property.type === experimental_utils_1.TSESTree.AST_NODE_TYPES.Identifier &&
                    node.property.name === 'length') {
                    const tsNode = service.esTreeNodeToTSNodeMap.get(node.object);
                    const type = (0, types_1.getType)(checker, tsNode);
                    if ((0, types_1.isArrayType)(checker, type)) {
                        context.report({
                            node: node.property,
                            messageId: 'arrayLengthViolation',
                            fix(fixer) {
                                return fixer.replaceText(node.property, 'size()');
                            }
                        });
                    }
                }
            }
        };
    }
});
