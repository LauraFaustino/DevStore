import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css';

import  {  ToastContainer,  toast  }  from  'react-toastify' ; 
import  'react-toastify/dist/ReactToastify.css' ;

import LoadingBar from 'react-top-loading-bar';

import Cabecalho from '../../components/cabecalho'
import Menu from '../../components/menu'

import { Container, Conteudo } from './styled'

import { useState, useEffect, useRef } from 'react';

import Api from '../../service/api';
const api = new Api();

export default function Index() {
    const [produto, setProduto] = useState ([]);
    const [nome, setNome] = useState ("");
    const [categoria, setCategoria] = useState ("");
    const [precoDe, setPrecoDe] = useState ("");
    const [precoPor, setPrecoPor] = useState ("");
    const [avaliacao, setAvaliacao] = useState ("");
    const [descricao, setDescricao] = useState ("");
    const [estoque, setEstoque] = useState ("");
    const [imagem, setImagem] = useState ("");
    const [idAlterando, setAIdlterando] = useState(0);

    const loading = useRef(null);

    async function listar () {
        let r = await api.listar();

        setProduto(r);
    }
    
    async function inserir() {

        loading.current.continuousStart();

        if (idAlterando == 0){
            let r = await api.inserir(nome, categoria, precoDe, precoPor, avaliacao, descricao, estoque, imagem);

            if (r.erro) 
                toast.dark(r.erro);
            else 
                toast.success('Produto inserido!');
        } else{
            let r = await api.alterar(idAlterando, nome, categoria, precoDe, precoPor, avaliacao, descricao, estoque, imagem);
           
            if (r.erro) 
                toast.dark(r.erro);
            else 
                toast.success('Produto alterado!');

        }
        loading.current.complete();
        limparCampos();
        listar();
    }

    function limparCampos(){
        setNome('');
        setCategoria('');
        setPrecoDe('');
        setPrecoPor('');
        setAvaliacao('');
        setEstoque('');
        setImagem('');
        setDescricao('');
        setAIdlterando(0);
    }

    async function remover(id) {
        confirmAlert ({
        title: 'Remover Produto',
        message: `Tem certeza de que deseja remover o produto ${id} ?`,
        buttons: [
            {
                label:'Sim',
                onClick: async () => {
                    let r = await api.remover(id);
                    if (r.erro)
                        toast.dark(`${r.erro}`);
                    else {
                        toast.success('Produto Removido');
                        listar();
                    }
                }
            },
            {
                label: 'Não'
            }
        ]
        });
    }

    async function editar(item) {
        setNome(item.nm_produto);
        setCategoria(item.ds_categoria);
        setPrecoDe(item.vl_preco_de);
        setPrecoPor(item.vl_preco_por);
        setAvaliacao(item.vl_avaliacao);
        setEstoque(item.qtd_estoque);
        setImagem(item.img_produto);
        setDescricao(item.ds_produto);
        setAIdlterando(item.id_produto);
    }

    useEffect(() => {
        listar();
    }, [])

    return (
        <Container>
            <ToastContainer/>
            <LoadingBar color='#000d1a' width= '1em' ref={loading} />
            <Menu />
            <Conteudo>
                <Cabecalho />
                <div class="body-right-box">
                    <div class="new-produto-box">
                        
                        <div class="text-new-produto">
                            <div class="bar-new-produto"></div>
                            <div class="text-new-produto">{ idAlterando == 0 ? "Novo Produto" : "Alterando Produto " + idAlterando }</div>
                        </div>

                        <div class="input-new-produto"> 
                            <div class="input-left">
                                <div class="agp-input"> 
                                    <div class="number-produto"> Nome: </div>  
                                    <div class="input"> <input type="text" value={nome} onChange={e => setNome(e.target.value)} /> </div>  
                                    <div class="corse-produto"> Preço DE: </div>  
                                    <div class="input"> <input type="text" value={precoDe} onChange={e => setPrecoDe(e.target.value)} /> </div> 
                                </div> 
                                <div class="agp-input">
                                    <div class="number-produto"> Categoria: </div>  
                                    <div class="input"> <input type="text" value={categoria} onChange={e => setCategoria(e.target.value)} /> </div>
                                    <div class="class-produto"> Preço POR: </div>  
                                    <div class="input"> <input type="text" value={precoPor} onChange={e => setPrecoPor(e.target.value)} /> </div>  
                                </div>
                                <div class="agp-input">
                                    <div class="number-produto"> Avaliação: </div>  
                                    <div class="input"> <input type="text" value={avaliacao} onChange={e => setAvaliacao(e.target.value)} /> </div> 
                                    <div class="class-produto"> Estoque: </div>  
                                    <div class="input"> <input type="text" value={estoque} onChange={e => setEstoque(e.target.value)} /> </div> 
                                </div>
                                <div class="input-buttom">
                                <div class="agp-input">
                                    <div class="number-produto1"> Link Imagem: </div>  
                                    <div class="input"> <input type="text" value={imagem} onChange={e => setImagem(e.target.value)}  style={{width: "38em"}} /> </div> 
                                </div>
                                <div class="agp-input">
                                    <div class="number-produto2"> Descrição: </div>  
                                    <div class="input"> <textarea type="text" value={descricao} onChange={e => setDescricao(e.target.value)}  style={{width: "38em", height: "15em"}} /> </div> 
                                </div>
                                </div>
                            </div>

                            <div class="button-create"> <button onClick={inserir}> {idAlterando == 0 ? "Cadastrar" : "Alterar"} </button> </div>
                        </div>
                    </div>

                    <div class="produto-registered-box">
                        <div class="row-bar"> 
                            <div class="bar-new-produto"> </div>
                            <div class="text-registered-produto"> Produtos Cadastrados </div>
                        </div>
                    
                        <table class ="table-user">
                            <thead>
                                <tr>
                                    <th class="coluna-acao"> </th>
                                    <th> ID </th>
                                    <th> Produto </th>
                                    <th> Categoria </th>
                                    <th> Preco </th>
                                    <th> Estoque </th>
                                    <th class="coluna-acao"> </th>
                                    <th class="coluna-acao"> </th>
                                </tr>
                            </thead>
                    
                            <tbody>
                            {produto.map((item, i) =>

                                <tr className= {i % 2 == 0 ? "Linha-alternada": ""}>
                                    <td title={item.img_produto}>
                                        <img  style={{width: "37px", height: "37px"}}src={item.img_produto} alt="" />
                                    </td>
                                    <td> {item.id_produto} </td>
                                    <td title={ item.nm_produto }> 
                                        {item.nm_produto != null && item.nm_produto.length >= 25 
                                            ? item.nm_produto.substr(0, 25) + '...' 
                                            : item.nm_produto }
                                    </td>
                                    <td> {item.ds_categoria} </td>
                                    <td> {item.vl_preco_por} </td>
                                    <td> {item.qtd_estoque} </td>
                                    <td> <button onClick={() => editar(item)}> <img src="/assets/images/edit.svg" alt="" /> </button> </td>
                                    <td> <button onClick={() => remover(item.id_produto) }> <img src="/assets/images/trash.svg" alt="" /> </button> </td>
                                </tr>
                            )}

                            </tbody> 
                        </table>
                    </div>
                </div>
            </Conteudo>
        </Container>
    )
}
