import { Linter, IOptions } from 'tslint/lib'
export const checkRule = (source: string, ruleName: string, ruleArguments?: any) => {

    const rulesMap = new Map<string, Partial<IOptions>>([[ruleName, { ruleName, ruleArguments, disabledIntervals: [] }]]);

    const linter = new Linter({
        fix: false,
        formatter: 'json',
        formattersDirectory: undefined,
        rulesDirectory: './lib'
    }, undefined)

    linter.lint('file.ts', source, {
        extends: [],
        jsRules: new Map<string, Partial<IOptions>>(),
        rules: rulesMap,
        rulesDirectory: []
    });

    return linter.getResult();
}