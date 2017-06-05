const path = require('path');

module.exports = {
  rulesDirectory: [
    path.join(path.dirname(require.resolve('tslint-microsoft-contrib')), './')
  ],
  rules: {
    'array-type': [true, 'array'],
    'arrow-return-shorthand': false,
    'await-promise': false,
    'adjacent-overload-signatures': false,
    'align': [
      false
    ],
    'arrow-parens': false,
    'ban': false,
    'callable-types': true,
    'chai-prefer-contains-to-index-of': true,
    'chai-vague-errors': true,
    'class-name': true,
    'comment-format': [
      false
    ],
    'completed-docs': [
      false
    ],
    'curly': true,
    'cyclomatic-complexity': [
      false
    ],
    'eofline': false,
    'export-name': true,
    'file-header': [
      false
    ],
    'forin': true,
    'function-name': true,
    'import-blacklist': false,
    'import-name': true,
    'import-spacing': true,
    'indent': [
      true,
      'spaces'
    ],
    'insecure-random': true,
    'interface-name': false,
    'interface-over-type-literal': false,
    'jquery-deferred-must-complete': true,
    'jsdoc-format': false,
    'label-position': true,
    'linebreak-style': [
      true,
      'LF'
    ],
    'max-classes-per-file': [
      false
    ],
    'max-file-line-count': [
      false
    ],
    'max-func-body-length': [
      true,
      100,
      {
        'ignore-parameters-to-function-regex': 'describe'
      }
    ],
    'max-line-length': [
      true,
      140
    ],
    'member-access': true,
    'member-ordering': [
      false
    ],
    'missing-jsdoc': true,
    'missing-optional-annotation': true,
    'mocha-avoid-only': true,
    'mocha-no-side-effect-code': true,
    'mocha-unneeded-done': true,
    'new-parens': true,
    'no-angle-bracket-type-assertion': false,
    'no-any': false,
    'no-arg': true,
    'no-backbone-get-set-outside-model': true,
    'no-banned-terms': true,
    'no-bitwise': true,
    'no-boolean-literal-compare': false,
    'no-conditional-assignment': true,
    'no-consecutive-blank-lines': [
      true
    ],
    'no-console': [
      true,
      'debug',
      'info',
      'log',
      'time',
      'timeEnd',
      'trace'
    ],
    'no-constant-condition': true,
    'no-construct': true,
    'no-control-regex': true,
    'no-cookies': true,
    'no-debugger': true,
    'no-default-export': true,
    'no-delete-expression': true,
    'no-disable-auto-sanitization': true,
    'no-document-domain': true,
    'no-document-write': true,
    'no-duplicate-case': true,
    'no-duplicate-parameter-names': true,
    'no-duplicate-super': true,
    'no-duplicate-variable': true,
    'no-empty': true,
    'no-empty-interface': true,
    'no-empty-interfaces': true,
    'no-empty-line-after-opening-brace': false,
    'no-eval': true,
    'no-exec-script': true,
    'no-floating-promises': false,
    'no-for-in': true,
    'no-for-in-array': false,
    'no-function-constructor-with-string-args': true,
    'no-function-expression': true,
    'no-http-string': [
      true,
      'http://www.example.com/?.*',
      'http://www.examples.com/?.*'
    ],
    'no-import-side-effect': true,
    'no-increment-decrement': true,
    'no-inferrable-types': false,
    'no-inferred-empty-object-type': false,
    'no-inner-html': true,
    'no-internal-module': false,
    'no-invalid-regexp': true,
    'no-invalid-template-strings': true,
    'no-invalid-this': true,
    'no-jquery-raw-elements': true,
    'no-magic-numbers': false,
    'no-mergeable-namespace': false,
    'no-missing-visibility-modifiers': true,
    'no-misused-new': true,
    'no-multiline-string': [true],
    'no-multiple-var-decl': true,
    'no-namespace': false,
    'no-null-keyword': false,
    'no-octal-literal': true,
    'no-parameter-properties': false,
    'no-reference': true,
    'no-reference-import': true,
    'no-regex-spaces': true,
    'no-require-imports': true,
    'no-reserved-keywords': true,
    'no-shadowed-variable': true,
    'no-single-line-block-comment': true,
    'no-sparse-arrays': true,
    'no-stateless-class': true,
    'no-string-based-set-immediate': true,
    'no-string-based-set-interval': true,
    'no-string-based-set-timeout': true,
    'no-string-literal': true,
    'no-string-throw': true,
    'no-suspicious-comment': true,
    'no-switch-case-fall-through': true,
    'no-trailing-whitespace': true,
    'no-typeof-undefined': true,
    'no-unbound-method': false,
    'no-unnecessary-bind': true,
    'no-unnecessary-callback-wrapper': true,
    'no-unnecessary-field-initialization': true,
    'no-unnecessary-initializer': true,
    'no-unnecessary-local-variable': true,
    'no-unnecessary-override': true,
    'no-unnecessary-qualifier': false,
    'no-unnecessary-semicolons': true,
    'no-unsafe-any': false,
    'no-unsafe-finally': true,
    'no-unsupported-browser-code': false,
    'no-unused-expression': true,
    'no-use-before-declare': true,
    'no-var-keyword': true,
    'no-var-requires': true,
    'no-var-self': true,
    'no-void-expression': false,
    'no-with-statement': true,
    'non-literal-require': true,
    'object-literal-key-quotes': [
      true,
      'as-needed'
    ],
    'object-literal-shorthand': false,
    'object-literal-sort-keys': false,
    'one-line': [
      true,
      'check-open-brace',
      'check-catch',
      'check-else',
      'check-whitespace'
    ],
    'one-variable-per-declaration': true,
    'only-arrow-functions': [true, 'allow-declarations', 'allow-named-functions'],
    'ordered-imports': [
      false
    ],
    'possible-timing-attack': true,
    'prefer-array-literal': true,
    'prefer-const': true,
    'prefer-for-of': false,
    'prefer-function-over-method': false,
    'prefer-method-signature': true,
    'prefer-template': false,
    'prefer-type-cast': true,
    'strict-type-predicates': false,
    'promise-function-async': false,
    'promise-must-complete': true,
    'quotemark': [
      true,
      'single'
    ],
    'radix': false,
    'react-a11y-anchors': true,
    'react-a11y-aria-unsupported-elements': true,
    'react-a11y-event-has-role': true,
    'react-a11y-image-button-has-alt': true,
    'react-a11y-img-has-alt': true,
    'react-a11y-lang': true,
    'react-a11y-meta': true,
    'react-a11y-props': true,
    'react-a11y-proptypes': true,
    'react-a11y-role': true,
    'react-a11y-role-has-required-aria-props': true,
    'react-a11y-role-supports-aria-props': true,
    'react-a11y-tabindex-no-positive': true,
    'react-a11y-titles': true,
    'react-anchor-blank-noopener': true,
    'react-iframe-missing-sandbox': true,
    'react-no-dangerous-html': true,
    'react-this-binding-issue': true,
    'react-tsx-curly-spacing': true,
    'react-unused-props-and-state': true,
    'restrict-plus-operands': false,
    'semicolon': [
      true,
      'ignore-bound-class-methods'
    ],
    'space-before-function-paren': false,
    'strict-boolean-expressions': false,
    'switch-default': false,
    'trailing-comma': [
      true,
      {
        'singleline': 'never',
        'multiline': 'never'
      }
    ],
    'triple-equals': [
      true,
      'allow-null-check'
    ],
    'typedef': [
      true,
      'parameter',
      'property-declaration',
      'member-variable-declaration'
    ],
    'typedef-whitespace': [
      false
    ],
    'typeof-compare': true,
    'underscore-consistent-invocation': true,
    'unified-signatures': true,
    'use-isnan': true,
    'use-named-parameter': true,
    'valid-typeof': true,
    'variable-name': true,
    'whitespace': [
      true,
      'check-branch',
      'check-decl',
      'check-operator',
      'check-separator',
      'check-type'
    ],
    'no-useless-files': true
  }
};
