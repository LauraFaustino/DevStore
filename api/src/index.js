import db from './db.js';
import express from 'express'
import cors from 'cors'

const app = express();
app.use(cors());
app.use(express.json());

app.get('/produto', async (req,resp) => {
    try{
        let p = await db.tb_produto.findAll({ order: [['id_produto', 'desc']] });
        resp.send(p);
    } catch (e) {
        resp.send({ erro: e.toString() })
    }
    
});

app.post('/produto', async (req, resp) => {
    try{
        let { nome, categoria, preco_de, preco_por, avaliacao, descricao, estoque, imagem } = req.body;

        let e = await db.tb_produto.findOne({where: {nm_produto: nome } })
            if (e != null){
                return resp.send({ erro: 'Produto já existe!' })
            }

            if(!nome || nome == ''){
                return resp.send({erro: 'O campo Nome é obrigatório'})
            }
            if (!categoria || categoria == ''){
                return resp.send({erro:'O campo Categoria é obrigatório'})
            }
            if (!avaliacao || avaliacao == ''){
                return resp.send({erro:'O campo Avaliação é obrigatório'})
            }
            if (!preco_de || preco_de == ''){
                return resp.send({erro:'O campo Preço DE é obrigatório'})
            }
            if (!preco_por || preco_por == ''){
                return resp.send({erro:'O campo Preco POR é obrigatório'})
            }
            if (!estoque || estoque == ''){
                return resp.send({erro:'O campo Estoque é obrigatório'})
            }
            if (!imagem || imagem == ''){
                return resp.send({erro:'O campo Link Imagem é obrigatório'})
            }
            if (!descricao || descricao == ''){
                return resp.send({erro:'O campo Descrição é obrigatório'})
            }

            if (preco_de < 0 ) {
                return resp.send({erro:'O campo Preço DE deve receber um número valido'})
            }
            if(isNaN(preco_de)){
                return resp.send({erro: 'Valor Preço DE inválido'});
            }
            if (preco_por < 0 ) {
                return resp.send({erro:'O campo Preço POR deve receber um número valido'})
            }
            if(isNaN(preco_por)){
                return resp.send({erro: 'Valor Preço POR inválido'});
            }
            if (avaliacao < 0 ) {
                return resp.send({erro:'O campo Avaliação deve receber um número valido'})
            }
            if(isNaN(avaliacao)){
                return resp.send({erro: 'Valor Avaliação inválido'});
            }
            if (estoque < 0 ) {
                return resp.send({erro:'O campo Estoque deve receber um número valido'})
            }
            if(isNaN(estoque)){
                return resp.send({erro: 'Valor Estoque inválido'});
            }

        let p = await db.tb_produto.create({
            nm_produto: nome,
            ds_categoria: categoria,
            vl_preco_de: preco_de,
            vl_preco_por: preco_por,
            vl_avaliacao: avaliacao,
            ds_produto: descricao,
            qtd_estoque: estoque,
            img_produto: imagem,
            bt_ativo: true,
            dt_inclusao: new Date()
        })
        resp.send(p);
   } catch (e){
       resp.send({ erro: e.toString() } )
   }
})

app.delete('/produto/:id', async(req, resp) => {
    try{
        let { id } = req.params;

        let p = await db.tb_produto.destroy({ where: {id_produto: id} })
        resp.sendStatus(200);
    } catch(e){
        resp.send({ erro: e.toString() })
    }
})

app.put('/produto/:id', async(req, resp) => {
    try{
        let {nome, categoria, preco_de, preco_por, avaliacao, descricao, estoque, imagem } = req.body;
            let { id } = req.params;

        let b = await db.tb_produto.update(
            {
                nm_produto: nome,
                ds_categoria: categoria,
                vl_preco_de: preco_de,
                vl_preco_por: preco_por,
                vl_avaliacao: avaliacao,
                ds_produto: descricao,
                qtd_estoque: estoque,
                img_produto: imagem,
                bt_ativo: true,
                dt_inclusao: new Date()
            },
            {
                where: {id_produto: id}
            });
            resp.sendStatus(200);
        } catch (e) {
            resp.send({ erro: e.toString() });
        }
});

app.listen(process.env.PORT,

    x => console.log(`Server up at port ${process.env.PORT}`))