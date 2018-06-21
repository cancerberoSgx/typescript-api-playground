// generated automatically using the command:  
//  ```dts-generator --name tsquery --out package-name.d.ts --project /home/sg/git/tsquery```

declare module '@phenomnomnominal/tsquery/src/ast' {
	import { SourceFile } from 'typescript';
	export function createAST(text: string, fileName?: string): SourceFile;

}
declare module '@phenomnomnominal/tsquery/src/tsquery-types' {
	import { Node, SourceFile, SyntaxKind } from 'typescript';
	export type TSQueryApi = {
	    <T extends Node = Node>(ast: string | Node | TSQueryNode<T>, selector: string): Array<TSQueryNode<T>>;
	    ast(text: string, fileName?: string): SourceFile;
	    match<T extends Node = Node>(ast: Node | TSQueryNode<T>, selector: TSQuerySelectorNode): Array<TSQueryNode<T>>;
	    matches(node: TSQueryNode, selector: TSQuerySelectorNode, ancestry: Array<TSQueryNode>): boolean;
	    parse(selector: string): TSQuerySelectorNode;
	    query<T extends Node = Node>(ast: string | Node | TSQueryNode<T>, selector: string): Array<TSQueryNode<T>>;
	    syntaxKindName(node: SyntaxKind): string;
	};
	export type TSQueryAttributeOperatorType = 'regexp' | 'literal' | 'type';
	export type TSQueryAttributeOperator = (obj: any, value: any, type: TSQueryAttributeOperatorType) => boolean;
	export type TSQueryAttributeOperators = {
	    [key: string]: TSQueryAttributeOperator;
	};
	export type TSQueryMatcher = (node: TSQueryNode, selector: TSQuerySelectorNode, ancestry: Array<TSQueryNode>) => boolean;
	export type TSQueryMatchers = {
	    [key: string]: TSQueryMatcher;
	};
	export type TSQueryNode<T extends Node = Node> = T & {
	    kindName: string;
	    name?: string;
	    text: string;
	    value?: any;
	};
	export type TSQuerySelectorNode = {
	    [key: string]: TSQuerySelectorNode | Array<TSQuerySelectorNode> | RegExp | boolean | number | string;
	    index: TSQuerySelectorNode;
	    left: TSQuerySelectorNode;
	    name: string;
	    operator: '=' | '!=' | '<=' | '<' | '>=' | '>';
	    right: TSQuerySelectorNode;
	    selectors: Array<TSQuerySelectorNode>;
	    subject: boolean;
	    type: TSQueryAttributeOperatorType;
	    value: TSQuerySelectorNode | RegExp | number | string;
	};
	export type TSQueryTraverseOptions<T extends Node = Node> = {
	    enter: (node: TSQueryNode<T>, parent: TSQueryNode<T> | null) => void;
	    leave: (node: TSQueryNode<T>, parent: TSQueryNode<T> | null) => void;
	};

}
declare module '@phenomnomnominal/tsquery/src/syntax-kind' {
	import { SyntaxKind } from 'typescript';
	export const syntaxKindMap: {
	    [key: string]: string;
	};
	export function syntaxKindName(kind: SyntaxKind): string;

}
declare module '@phenomnomnominal/tsquery/src/traverse' {
	import { Node } from 'typescript';
	import { TSQueryNode, TSQueryTraverseOptions } from '@phenomnomnominal/tsquery/src/tsquery-types';
	export function traverse(node: Node | TSQueryNode, options: TSQueryTraverseOptions): void;
	export function traverseChildren(node: Node | TSQueryNode, iterator: (childNode: TSQueryNode, ancestors: Array<TSQueryNode>) => void): void;
	export function getVisitorKeys(node: TSQueryNode | null): Array<string>;
	export function addProperties(node: TSQueryNode): void;

}
declare module '@phenomnomnominal/tsquery/src/utils' {
	import { Node } from 'typescript';
	export function getPath(obj: any, path: string): any;
	export function inPath(node: Node, ancestor: Node, path: Array<string>): boolean;

}
declare module '@phenomnomnominal/tsquery/src/matchers/attribute' {
	import { TSQueryNode, TSQuerySelectorNode } from '@phenomnomnominal/tsquery/src/tsquery-types';
	export function attribute(node: TSQueryNode, selector: TSQuerySelectorNode): boolean;

}
declare module '@phenomnomnominal/tsquery/src/matchers/child' {
	import { TSQueryNode, TSQuerySelectorNode } from '@phenomnomnominal/tsquery/src/tsquery-types';
	export function child(node: TSQueryNode, selector: TSQuerySelectorNode, ancestry: Array<TSQueryNode>): boolean;

}
declare module '@phenomnomnominal/tsquery/src/matchers/class' {
	import { TSQueryNode, TSQuerySelectorNode } from '@phenomnomnominal/tsquery/src/tsquery-types';
	export function classs(node: TSQueryNode, selector: TSQuerySelectorNode, ancestry: Array<TSQueryNode>): boolean;

}
declare module '@phenomnomnominal/tsquery/src/matchers/descendant' {
	import { TSQueryNode, TSQuerySelectorNode } from '@phenomnomnominal/tsquery/src/tsquery-types';
	export function descendant(node: TSQueryNode, selector: TSQuerySelectorNode, ancestry: Array<TSQueryNode>): boolean;

}
declare module '@phenomnomnominal/tsquery/src/matchers/field' {
	import { TSQueryNode, TSQuerySelectorNode } from '@phenomnomnominal/tsquery/src/tsquery-types';
	export function field(node: TSQueryNode, selector: TSQuerySelectorNode, ancestry: Array<TSQueryNode>): boolean;

}
declare module '@phenomnomnominal/tsquery/src/matchers/has' {
	import { TSQueryNode, TSQuerySelectorNode } from '@phenomnomnominal/tsquery/src/tsquery-types';
	export function has(node: TSQueryNode, selector: TSQuerySelectorNode): boolean;

}
declare module '@phenomnomnominal/tsquery/src/matchers/identifier' {
	import { TSQueryNode, TSQuerySelectorNode } from '@phenomnomnominal/tsquery/src/tsquery-types';
	export function identifier(node: TSQueryNode, selector: TSQuerySelectorNode): boolean;

}
declare module '@phenomnomnominal/tsquery/src/matchers/matches' {
	import { TSQueryNode, TSQuerySelectorNode } from '@phenomnomnominal/tsquery/src/tsquery-types';
	export function matches(modifier: 'some' | 'every'): (node: TSQueryNode, selector: TSQuerySelectorNode, ancestry: Array<TSQueryNode>) => boolean;

}
declare module '@phenomnomnominal/tsquery/src/matchers/not' {
	import { TSQueryNode, TSQuerySelectorNode } from '@phenomnomnominal/tsquery/src/tsquery-types';
	export function not(node: TSQueryNode, selector: TSQuerySelectorNode, ancestry: Array<TSQueryNode>): boolean;

}
declare module '@phenomnomnominal/tsquery/src/matchers/nth-child' {
	import { TSQueryNode, TSQuerySelectorNode } from '@phenomnomnominal/tsquery/src/tsquery-types';
	export function nthChild(node: TSQueryNode, selector: TSQuerySelectorNode, ancestry: Array<TSQueryNode>): boolean;
	export function nthLastChild(node: TSQueryNode, selector: TSQuerySelectorNode, ancestry: Array<TSQueryNode>): boolean;

}
declare module '@phenomnomnominal/tsquery/src/matchers/sibling' {
	import { TSQueryNode, TSQuerySelectorNode } from '@phenomnomnominal/tsquery/src/tsquery-types';
	export function sibling(node: TSQueryNode, selector: TSQuerySelectorNode, ancestry: Array<TSQueryNode>): boolean;
	export function adjacent(node: TSQueryNode, selector: TSQuerySelectorNode, ancestry: Array<TSQueryNode>): boolean;

}
declare module '@phenomnomnominal/tsquery/src/matchers/wildcard' {
	export function wildcard(): boolean;

}
declare module '@phenomnomnominal/tsquery/src/matchers/index' {
	import { TSQueryMatchers } from '@phenomnomnominal/tsquery/src/tsquery-types';
	export const MATCHERS: TSQueryMatchers;

}
declare module '@phenomnomnominal/tsquery/src/match' {
	import { Node } from 'typescript';
	import { TSQueryNode, TSQuerySelectorNode } from '@phenomnomnominal/tsquery/src/tsquery-types';
	export function match<T extends Node = Node>(node: Node | TSQueryNode<T>, selector: TSQuerySelectorNode): Array<TSQueryNode<T>>;
	export function findMatches(node: TSQueryNode, selector: TSQuerySelectorNode, ancestry?: Array<TSQueryNode>): boolean;

}
declare module '@phenomnomnominal/tsquery/src/parse' {
	import { TSQuerySelectorNode } from '@phenomnomnominal/tsquery/src/tsquery-types';
	export function parse(selector: string): TSQuerySelectorNode;

}
declare module '@phenomnomnominal/tsquery/src/query' {
	import { Node } from 'typescript';
	import { TSQueryNode } from '@phenomnomnominal/tsquery/src/tsquery-types';
	export function query<T extends Node = Node>(ast: string | Node | TSQueryNode<T>, selector: string): Array<TSQueryNode<T>>;

}
declare module '@phenomnomnominal/tsquery' {
	import { TSQueryApi } from '@phenomnomnominal/tsquery/src/tsquery-types';
	export const tsquery: TSQueryApi;

}