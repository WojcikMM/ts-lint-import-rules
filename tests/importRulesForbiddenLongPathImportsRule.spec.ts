import { checkRule } from "./helpers";
import { expect } from 'chai';

const ruleName = 'import-rules-forbidden-long-path-imports';

describe('GIVEN import-rules-forbidden-long-path-imports', () => {
    it('WHEN forbidden path is defined THEN should throw error', () => {
        const source = `import { something } from '@angular/cli/testing';
            export class SampleClass {
                public xyz: number;
            }`

        const result = checkRule(source, ruleName, ['@angular']);
        expect(result.errorCount).to.equal(1);
        expect(result.warningCount).to.equal(0);
        expect(result.output.indexOf('@angular/cli/testing')).to.not.equal(-1);
    });

    it('WHEN path is equal provided prefix but is short THEN should not throw errors or warnings', () => {
        const source = `import { something } from '@angular/cli'`;
        const result = checkRule(source, ruleName, ['@angular'])
    });

    it('WHEN provided forbidden path has three nestings THEN equal or more nestings should throw error', () => {
        const source = `import { something } from '@angular/cli/testing';
            export class SampleClass {
                public xyz: number;
            }`

        const result = checkRule(source, ruleName, ['@angular/cli/testing']);
        expect(result.errorCount).to.equal(1);
        expect(result.warningCount).to.equal(0);
        expect(result.output.indexOf('@angular/cli/testing')).to.not.equal(-1);
    })
})