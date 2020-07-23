import { Fix, IRuleMetadata, Rules, RuleFailure, RuleWalker, Replacement } from 'tslint';
import {
    SourceFile,
    ImportDeclaration
} from 'typescript';

export class Rule extends Rules.AbstractRule {

    static readonly metadata: IRuleMetadata = {
        description: 'This rule prevents imports from long paths from provided prefixes.',
        hasFix: false,
        options: {
            items: [
                {
                    type: 'string'
                },
            ],
            maxLength: 2,
            minLength: 0,
            type: 'array'
        },
        optionsDescription: `This Rule is for checking behaviors like:
                            - Importing one element in multi-line formatting
                            ( for disable please add to tslint config : 'allow-multiple-imports-in-single-line')
                            - Importing many elements in single-line formatting
                            (for disable please add to tslint config 'allow-single-imports-in-multiline')

                            "import-rules-formatting-imports":[true, "allow-multiple-imports-in-single-line", "allow-single-imports-in-multiline"]`,
        rationale: 'For more clarity there is need to have single import inline but many imports in multiline.',
        ruleName: 'import-rules-formatting-imports',
        type: 'style',
        typescriptOnly: true
    };

    public apply(sourceFile: SourceFile): RuleFailure[] {
        return this.applyWithWalker(new NoManyInlineImportsWalker(sourceFile, this.getOptions()));
    }
}

/* This Rule is for checking behaviors like:
  - Importing one element in multi-line formatting
    ( for disable please add to tslint config : 'allow-multiple-imports-in-single-line')
  - Importing many elements in single-line formatting
    (for disable please add to tslint config 'allow-single-imports-in-multiline')

   "import-rules-formatting-imports":[true, "allow-multiple-imports-in-single-line", "allow-single-imports-in-multiline"]
*/

class NoManyInlineImportsWalker extends RuleWalker {
    public visitImportDeclaration(node: ImportDeclaration) {
        // create a failure at the current position
        const allowMultipleImportsInSingleLineConst = 'allow-multiple-imports-in-single-line';
        const allowSingleImportsInMultiLineConst = 'allow-single-imports-in-multiline';
        const options: string[] = this.getOptions();
        const checkMultiImportsInSingleLine = options.indexOf(allowMultipleImportsInSingleLineConst) === -1;
        const checkSingleImportsInMultiLine = options.indexOf(allowSingleImportsInMultiLineConst) === -1;

        if (checkMultiImportsInSingleLine) {
            const pattern = /import\s*{\s*(((\w+[ \t]*,\s*)*(\w+[ \t]*,[ \t]*){2,}(\n?[ \t]*\w+,?[ \t]*)*)|((\w+[ \t]*,[ \t]*\s*)+\w+,[ \t]*([ \t]*\w+)))[ \t]*\s*}\s*from\s*(.*)/g;
            const errorMessage = 'too many imports in one line';

            const results: RegExpExecArray | null = pattern.exec(node.getText());

            if (results !== null) {
                const correctFormattedImportModules = results[1]
                    .split(',')
                    .map((module: string) => module.trim())
                    .join(',\n    ');

                const fixedImport = `import {\n    ${correctFormattedImportModules}\n} from ${results[9]}`;
                this._checkImport(node, errorMessage, fixedImport);
            }
        }

        if (checkSingleImportsInMultiLine) {
            const pattern = /import\s*{[ \t]*[\n\r]*[ \t]*(\S*)[ \t]*[\n\r]+\s*}\s*from\s*(.*)/g;
            const errorMessage = 'single import should be in one line';
            const replacer = 'import { $1 } from $2';

            const results: RegExpExecArray | null = pattern.exec(node.getText());
            if (results !== null) {
                const fixedImport: string = node.getText().replace(pattern, replacer);
                this._checkImport(node, errorMessage, fixedImport);
            }

        }

        super.visitImportDeclaration(node);
    }

    private _checkImport(node: ImportDeclaration, errorMessage: string, fixedImport?: string) {
        const issueText = node.getText();
        const errorText = `${errorMessage} : ${issueText}`;
        const fix: Fix | undefined = !!fixedImport ? new Replacement(node.getStart(), node.getWidth(), fixedImport) : undefined;
        this.addFailureAt(node.getStart(), node.getWidth(), errorText, fix);
    }
}
