# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - heading "App de Notas" [level=1] [ref=e5]
  - main [ref=e6]:
    - paragraph [ref=e7]: Bienvenido, Luis Tester!
    - button "log out" [ref=e8] [cursor=pointer]
    - generic [ref=e9]:
      - button "Todas" [disabled] [ref=e10] [cursor=pointer]
      - button "Importantes" [ref=e11] [cursor=pointer]
      - button "No importantes" [ref=e12] [cursor=pointer]
    - generic [ref=e13]:
      - textbox "Buscar nota..." [ref=e14]
      - list [ref=e15]:
        - listitem [ref=e16]:
          - generic [ref=e17]: Nota importante
          - button "☆ Marcar importante" [ref=e18] [cursor=pointer]
          - button "Eliminar" [ref=e19] [cursor=pointer]
        - listitem [ref=e20]:
          - generic [ref=e21]: Nota importante
          - button "☆ Marcar importante" [ref=e22] [cursor=pointer]
          - button "Eliminar" [ref=e23] [cursor=pointer]
    - generic [ref=e24]:
      - textbox "Nueva nota" [ref=e25]
      - button "Agregar" [active] [ref=e26] [cursor=pointer]
```