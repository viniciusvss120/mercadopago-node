const express = require('express')
const MercadoPago = require('mercadopago')
const app = express()

MercadoPago.configure({
    sendbox: true,
    access_token: "TEST-8291668911092233-100316-d128dad8f3c96bbfa866aa7c4a4bc197-1209868381"
})

app.get("/", (req,res) => {
    res.send("hello, Word!" + Date.now())
})

app.get("/pagar", async (req,res) => {

    // informações que deve ser salvas no banco de dados

    //id // codigo// //pagador //status
    //1 //1664829674952 // "vinicius@gmail.com" // Não foi pago
    //2 //1664829674953 // "vinicius@gmail.com" // Pago

    let id = "" + Date.now()
    let emailDoPagador = "vinicius@gmail.com"

    const dados = {
        items: [
            {
                id: id,
                title: "2x video games;3x camisas",
                quantity: 1,
                currency_id: 'BRL',
                unit_price: parseFloat(150)
            }
        ],
        payer: {
            email: emailDoPagador
        },
        external_reference: id
    }
    try {

        let pagamento = await MercadoPago.preferences.create(dados)
        console.log(pagamento)
        //Banco.SalvarPagamento({id: id, pagador: emailDoPagador})
        return res.redirect(pagamento.body.init_point)

    } catch (error) {
        return res.send(error.message)
    }

  
})

app.post("/not", (req, res) => {
    let id = req.query.id

    setTimeout(() => {
        let filtro = {
            "oder.id": id
        }

        MercadoPago.payment.search({
            qs: filtro
        }).then(data => {
            let pagamento = data.body.results[0]

            if(pagamento != undefined){
                console.log(pagamento)
            }else{
                console.log("Pagamento não existe!")
            }
        }).catch(err => {
            console.log(err)
        })
    },20000)

    res.send("ok")
})

app.listen(8080, () => {
    console.log("Servidor rodando!")
})

// 413380Vss