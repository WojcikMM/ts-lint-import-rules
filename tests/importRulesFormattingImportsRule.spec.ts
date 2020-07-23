import { checkRule } from "./helpers";
import { expect } from 'chai';

const ruleName = 'import-rules-formatting-imports';


describe('GIVEN import-rules-formatting-imports', () => {
    it('WHEN single import is defined inline THEN should pass', () => {
        const source = `import { something } from '@angular/cli/testing';`

        const result = checkRule(source, ruleName);
        expect(result.errorCount).to.equal(0);
        expect(result.warningCount).to.equal(0);
    });

    it('WHEN multiple import is defined in multiple lines THEN should pass', () => {
        const source = `import {
            something,
            xyz,
            someLongDependency
         } from '@angular/cli/testing';`

        const result = checkRule(source, ruleName);
        expect(result.errorCount).to.equal(0);
        expect(result.warningCount).to.equal(0);
    })
});