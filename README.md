# clone-tabnews

Implementação do TabNews do zero.

<details>
<summary>🌿 Git</summary>

### 🗑️ Deletar branch

Para deletar uma branch local:

```bash
git branch -d NOME_DA_BRANCH
```

Caso a branch ainda não tenha sido mesclada e seja necessário forçar a exclusão:

```bash
git branch -D NOME_DA_BRANCH
```

### ♻️ Recuperar branch

Caso uma branch tenha sido excluída acidentalmente, é possível recuperá-la a partir do commit em que ela estava.

#### 1. Localizar o commit

O `git reflog` registra alterações realizadas nas referências do Git:

```bash
git reflog
```

Procure pelo commit em que a branch estava antes de ser excluída.

#### 2. Criar a branch novamente

Depois de identificar o hash do commit:

```bash
git checkout -b NOME_DA_BRANCH HASH_DO_COMMIT
```

Ou, acessando o commit primeiro:

```bash
git checkout HASH_DO_COMMIT
git checkout -b NOME_DA_BRANCH
```

> **Dica:** a primeira opção é mais prática, pois cria a branch diretamente a partir do commit.

</details>
