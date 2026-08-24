# clone-tabnews

Implementação do [TabNews](https://www.tabnews.com.br/) do zero, com foco em
aprendizado e aplicação prática de conceitos de desenvolvimento web.

---

## 🌿 Git

### 🗑️ Deletar branch

Para deletar uma branch local:

```bash
git branch -d NOME_DA_BRANCH
```

Caso a branch ainda não tenha sido mesclada e seja necessário forçar a exclusão:

```bash
git branch -D NOME_DA_BRANCH
```

---

### ♻️ Recuperar uma branch deletada

Caso uma branch tenha sido excluída acidentalmente, é possível recuperá-la a
partir do commit em que ela estava.

#### 1. Localizar o commit

O `git reflog` registra alterações realizadas nas referências do Git, incluindo
commits que não estão mais associados a uma branch:

```bash
git reflog
```

Procure pelo commit em que a branch estava antes de ser excluída.

#### 2. Criar a branch novamente

Depois de identificar o hash do commit:

```bash
git checkout HASH_DO_COMMIT
```

Ou, diretamente, crie a nova branch a partir do commit:

```bash
git checkout -b NOME_DA_BRANCH HASH_DO_COMMIT
```

> **Dica:** a segunda opção é mais prática, pois cria e posiciona você na nova
> branch em um único comando.

---

## 📌 Comandos úteis

| Objetivo                                      | Comando                                         |
| --------------------------------------------- | ----------------------------------------------- |
| Deletar branch                                | `git branch -d NOME_DA_BRANCH`                  |
| Forçar exclusão                               | `git branch -D NOME_DA_BRANCH`                  |
| Consultar histórico das referências           | `git reflog`                                    |
| Criar branch a partir do commit atual         | `git checkout -b NOME_DA_BRANCH`                |
| Criar branch a partir de um commit específico | `git checkout -b NOME_DA_BRANCH HASH_DO_COMMIT` |
