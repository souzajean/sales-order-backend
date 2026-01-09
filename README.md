# Getting Started

Welcome to your new project.

It contains these folders and files, following our recommended project layout:

File or Folder | Purpose
---------|----------
`app/` | content for UI frontends goes here
`db/` | your domain models and data go here
`srv/` | your service models and code go here
`package.json` | project metadata and configuration
`readme.md` | this getting started guide


## Next Steps

- Open a new terminal and run `cds watch`
- (in VS Code simply choose _**Terminal** > Run Task > cds watch_)
- Start adding content, for example, a [db/schema.cds](db/schema.cds).


## Config Git

```ini
[user]
    name = Jean Cardoso de Souza
    email = blahjeancs1@hotmail.com

[credential]
    helper = store

[core]
    editor = code --wait

[alias]
    s  = !git status -s
    c  = !git add --all && git commit -m
    l  = !git log --pretty=format:'%C(blue)%h%C(red)%d %C(white)%s - %C(cyan)%cn, %C(green)%cr'
    cm = !git checkout master && git pull origin master
    cn = !git add --all && git commit --no-verify -m
    pu = !git pull origin
    po = !git push origin
    pon = !git push origin --no-verify


    #Query
    http://localhost:4004/odata/v4/main/SalesOrderHeaders?$expand=items($expand=product($select=id,name))


    #Adicionar dados simulados
    cds add data --records 10 --out test/data

    #Adicionar SQLite
    Crontol + Shifth + P
    cds deploy -2 sqlite:db.sqlite
    sudo apt install sqlite3
     yarn add -D tsx @cap-js/cds-typer typescript @types/node
     yarn tsc --init
     yarn tsc
     yarn add -D @types/axios
     node dist/srv/main.js
     yarn tsx srv/main.ts
