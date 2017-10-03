import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Home extends Component {
  render() {
    return (
      <div className="container" style={{ maxWidth: '750px', marginTop: '30px' }}>
        <div className="jumbotron">
          <h1>S Demagogem</h1>

          <p className="lead">
            Experiment propojení videozáznamu politické diskuze s ověřenými fakty z projektu Demagog.cz.
            {' '}
            Propojení takovým způsobem, aby šlo sledovat diskuzi a zároveň vidět, které výroky (a s jakým výsledkem) jsou ověřené.
            {' '}
            Lidově řečeno: „Aby šlo na diskuzi koukat <em>s Demagogem.</em>“
          </p>

          <hr />

          <p className="lead">
            Zatím je takto propojena jen jedna diskuze z Českého rozhlasu s Ivanem Bartošem, lídrem České pirátské strany, ze dne 29. září 2017:
          </p>

          <Link to="/volby-2017-lidr-piratu-v-cro">
            <h2>Volby 2017: Lídr Pirátů v ČRo</h2>
          </Link>
        </div>

        <p className="text-muted">
          Všechna data jsou zkopírována ze serveru Demagog.cz a v rámci experimentu zde použita bez svolení.
          <br />
          Kontakt: <a href="mailto:jan.vlcek@vlki.cz">jan.vlcek@vlki.cz</a>
        </p>
      </div>
    )
  }
}

export default Home
