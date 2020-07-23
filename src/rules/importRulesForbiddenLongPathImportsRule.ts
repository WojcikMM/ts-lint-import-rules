import { IOptions, IRuleMetadata, RuleFailure, Rules, RuleWalker } from 'tslint/lib';
import { ImportDeclaration, SourceFile } from 'typescript/lib/typescript';

export class Rule extends Rules.AbstractRule {
    static readonly metadata: IRuleMetadata = {
        description: 'This rule prevents imports from long paths from provided prefixes.',
        hasFix: false,
        options: {
            items: [
                {
                    oneOf: [
                        {
                            items: {
                                type: 'string'
                            },
                            type: 'array'
                        },
                        {
                            type: 'string'
                        }
                    ]
                },
            ],
            maxLength: 10,
            minLength: 1,
            type: 'array'
        },
        optionsDescription: 'List of scoped packages names prefixes which should be imported with short paths only',
        rationale: 'Short imports will allows us to avoid some problems during development.',
        ruleName: 'import-rules-forbidden-long-path-imports',
        type: 'style',
        typescriptOnly: true
    };

    apply(sourceFile: SourceFile): RuleFailure[] {
        return this.applyWithWalker(new ProhibitedLongPathImportWalker(sourceFile, this.getOptions()));
    }

    constructor(options: IOptions) {
        super(options);
    }
}

export const getFailureMessage = (tooLongPath: string): string => {
    return `It is forbidden to import: "${tooLongPath}" with long path from this resource. Try use short import.`;
};

class ProhibitedLongPathImportWalker extends RuleWalker {
    scopedPackagesNamesPrefixes = Array<any>();

    constructor(sourceFile: SourceFile, options: IOptions) {
        super(sourceFile, options);
        this.scopedPackagesNamesPrefixes = options.ruleArguments;
    }

    protected visitImportDeclaration(node: ImportDeclaration) {
        this._validateImportsPaths(node);
        super.visitImportDeclaration(node);
    }

    private _validateImportsPaths(node: ImportDeclaration): void {
        const nodeText = node.getText();

        this.scopedPackagesNamesPrefixes.forEach((scopedPackagesNamesPrefix) => {
            if ((nodeText.indexOf(scopedPackagesNamesPrefix) > -1) && (nodeText.match(/\//g) || []).length > 1) {
                this.addFailureAtNode(node, getFailureMessage((node.moduleSpecifier as any).text));
            }
        });
    }
}