import {parser} from "../gen/tao-lang-parser"
console.log(parser.parse('one 2 "three"').toString())