"""
Creative Portfolio — Vitor Mendes Padovani
Servidor Flask simples, responsável apenas por renderizar a página
e servir os arquivos estáticos (CSS, JS, imagens e vídeos).

Compatível com execução local (PC) e com Pydroid 3 no Android.
"""

from flask import Flask, render_template

app = Flask(__name__, static_folder="static", template_folder="templates")


@app.route("/")
def index():
    """Renderiza a página única do portfólio."""
    return render_template("index.html")


if __name__ == "__main__":
    # host="0.0.0.0" permite acessar o site por outros dispositivos
    # na mesma rede (útil ao rodar pelo Pydroid 3 no celular).
    # debug=True facilita o desenvolvimento, mas pode ser desativado
    # em produção (defina debug=False).
    app.run(host="0.0.0.0", port=5000, debug=True)
