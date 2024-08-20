import { parser } from "../gen/tao-lang-parser"
import { testTree } from "@lezer/generator/test"

let tree = parser.parse(`
    state TestState {
        foo: Number
        bar: String
        cat: Boolean
        mat: [Number]
        hat: { name: String age: Number }
    }    
`)
let spec = `File(
    StateDeclaration(
        Keyword(state)
        Identifier
        StateObject(
            StateProperty(
                Identifier
                AtomicType(
                    Keyword("Number")
                )
            )
            StateProperty(
                Identifier
                AtomicType(
                    Keyword(String)
                )
            )
            StateProperty(
                Identifier
                AtomicType(
                    Keyword(Boolean)
                )
            )
            StateProperty(
                Identifier
                StateArray(
                    AtomicType(
                        Keyword(Number)
                    )
                )
            )
            StateProperty(
                Identifier
                StateObject(
                    StateProperty(
                        Identifier
                        AtomicType(
                            Keyword(String)
                        )
                    )
                    StateProperty(
                        Identifier
                        AtomicType(
                            Keyword(Number)
                        )
                    )
                )
            )
        )
    )
)
`

testTree(tree, spec)