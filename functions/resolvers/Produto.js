const admin = require("firebase-admin")

module.exports = {
    Query: {
        produto: () => {
            return admin.database()
                .ref("produtos")
                .once("value")
                .then((snap) => snap.val())
                .then((val) => Object.keys(val).map((key) => val[key]))
        },
    },
    Mutation: {
        novoProduto(
            _,
            { id, nomeproduto, descricao, fornecedor, preco, datacadastro }
        ) {
            const novo = {
                id: id,
                nomeproduto: nomeproduto,
                descricao: descricao,
                fornecedor: fornecedor,
                preco: preco,
                datacadastro: datacadastro,
            }
            admin.database().ref("produtos").push(novo)

            return admin.database()
                .ref("produtos")
                .limitToLast(1)
                .once("value")
                .then((snap) => snap.val())
                .then((val) => Object.keys(val).map((key) => val[key]))
        }, 
        excluirProduto(_, { id }) {
            return admin.database()
                .ref("produtos")
                .orderByChild("id")
                .equalTo(id)
                .once("value")
                .then((snap) => snap.val())
                .then((val) => {
                    if (val) {
                        const firstKey = Object.keys(val)[0];
                        admin.database().ref("produtos").child(firstKey).remove()
                        return val[firstKey]
                    }
                })
        },
        alterarProduto(
            _,
            { id, nomeproduto, descricao, fornecedor, preco, datacadastro }
        ) {
            return admin.database()
                .ref("produtos")
                .orderByChild("id")
                .equalTo(id)
                .once("value")
                .then((snap) => snap.val())
                .then((val) => {
                    if (val) {
                        const firstKey = Object.keys(val)[0]
                        let produtoAlterado = val[firstKey]
                        produtoAlterado.nomeproduto = nomeproduto
                        produtoAlterado.descricao = descricao
                        produtoAlterado.fornecedor = fornecedor
                        produtoAlterado.preco = preco
                        produtoAlterado.datacadastro = datacadastro

                        console.log("produtoAlterado", produtoAlterado)

                        admin.database()
                            .ref("produtos")
                            .child(firstKey)
                            .set(produtoAlterado)
                        return produtoAlterado
                    }
                })
        },
    },
}