import React, { Component } from 'react'
import YouTube from 'react-youtube'
import ReactTooltip from 'react-tooltip'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'

import allData from './data'
import { formatTime, parseTime, convertNewlinesToBr } from './utils'

const CHECK_PLAYER_TIME_INTERVAL_MS = 200

class Theater extends Component {
  checkInterval = null
  player = null
  checkPanels = {}
  lastScrollTimestamp = null

  constructor(props) {
    super(props)

    let discussionData = allData.find(discussion => discussion.path === props.match.path)

    discussionData = Object.assign({}, discussionData, {
      checks: discussionData.checks.map(check =>
        Object.assign({}, check, {
          highlightStartSeconds: parseTime(check.highlightStart),
          highlightEndSeconds: parseTime(check.highlightEnd)
        })
      )
    })

    this.state = {
      time: null,
      shownExplanations: [],
      discussionData
    }
  }

  componentDidMount() {
    this.checkInterval = setInterval(this.checkPlayerTime, CHECK_PLAYER_TIME_INTERVAL_MS)
  }

  componentWillUnmount() {
    clearInterval(this.checkInterval)
    this.checkInterval = null
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.time !== this.state.time && this.state.time !== null) {
      let checkIndex = this.state.discussionData.checks.findIndex(check => check.highlightStartSeconds >= this.state.time) - 1
      if (checkIndex < 0) {
        checkIndex = 0
      }

      // Don't call scroll too often
      let isScrolling = false
      if (this.lastScrollTimestamp !== null && Date.now() < (this.lastScrollTimestamp + 1000)) {
        isScrolling = true
      }

      if (this.checkPanels[checkIndex] && !isScrolling) {
        window.scroll({
          top: this.checkPanels[checkIndex].offsetTop,
          left: 0,
          behavior: 'smooth'
        })
        this.lastScrollTimestamp = Date.now()
      }
    }
  }

  handlePlayerReady = (event) => {
    this.player = event.target
  }

  checkPlayerTime = () => {
    if (this.player !== null) {
      this.setState({ time: this.player.getCurrentTime() })
    }
  }

  handleCheckTimeClick = (e, check) => {
    if (this.player !== null) {
      this.player.seekTo(check.highlightStartSeconds, true)
    }

    e.preventDefault()
    return false
  }

  handleToggleExplanation = (e, check, index) => {
    const { shownExplanations } = this.state

    if (shownExplanations.indexOf(index) === -1) {
      // hidden, show
      this.setState({
        shownExplanations: [...shownExplanations, index]
      })
    } else {
      // shown, hide
      this.setState({
        shownExplanations: shownExplanations.filter(i => i !== index)
      })
    }

    e.preventDefault()
    return false
  }

  render() {
    const { discussionData, time, shownExplanations } = this.state

    return (
      <div className="container" style={{ marginTop: 30, width: '1170px' }}>
        <div className="row">
          <div className="col-xs-8">
            <div style={{ position: 'fixed', width: '750px' }}>
              <YouTube
                videoId={discussionData.videoId}
                opts={{
                  width: 750,
                  height: 457
                }}
                onReady={this.handlePlayerReady}
              />

              <h1>{discussionData.title}</h1>

              <p className="lead">
                {discussionData.subtitle}
              </p>

              <p>
                Video na YouTube: <a href={discussionData.youtubeUrl} target="_blank">{discussionData.youtubeUrl}</a>
                <br />
                Rozbor diskuze na Demagog.cz: <a href={discussionData.demagogUrl} target="_blank">{discussionData.demagogUrl}</a>
              </p>

              <hr />

              <p>
                <Link to="/" className="btn btn-default">
                  <span className="glyphicon glyphicon-chevron-left" />
                  {' '}
                  Zpět na hlavní stránku projektu
                </Link>
              </p>

              <p className="text-muted">
                S Demagogem je experiment propojení videozáznamu politické diskuze s ověřenými fakty z projektu Demagog.cz.
                {' '}
                Propojení takovým způsobem, aby šlo sledovat diskuzi a zároveň vidět, které výroky (a s jakým výsledkem) jsou ověřené.
                {' '}
                Lidově řečeno: „Aby šlo na diskuzi koukat <em>s Demagogem.</em>“
              </p>

              <p className="text-muted">
                Všechna data jsou zkopírována ze serveru Demagog.cz a v rámci experimentu zde použita bez svolení.<br />
                Veškerý kód je veřejně dostupný <a href="https://github.com/vlki/s-demagogem">na GitHubu</a>.<br />
                Kontakt: <a href="mailto:jan.vlcek@vlki.cz">jan.vlcek@vlki.cz</a>
              </p>
            </div>
          </div>
          <div className="col-xs-4">
            {discussionData.checks.map((check, index) =>
              <div
                key={index}
                ref={checkPanel => this.checkPanels[index] = checkPanel}
                className={'panel ' + (time >= check.highlightStartSeconds && time <= check.highlightEndSeconds ? 'panel-primary' : 'panel-default')}
              >
                <div className="panel-heading">
                  <span
                    style={{ display: 'inline-block' }}
                    data-tip={`Kliknutím skočte na čas ${formatTime(check.highlightStartSeconds)}`}
                    data-for={`check-${index}`}
                  >
                    <TimeLink
                      highlighted={time >= check.highlightStartSeconds && time <= check.highlightEndSeconds}
                      href=""
                      onClick={e => this.handleCheckTimeClick(e, check)}
                    >
                      {formatTime(check.highlightStartSeconds)}–{formatTime(check.highlightEndSeconds)}
                    </TimeLink>
                  </span>

                  <ReactTooltip place="right" id={`check-${index}`} effect="solid" />
                </div>
                <div className="panel-body">
                  <p><i>{'„' + check.statement + '“'}</i></p>
                  <p style={{ marginTop: 20 }}><CheckResultBadge result={check.result} /></p>
                  <p style={{ marginTop: 20 }}>
                    <a href="" onClick={e => this.handleToggleExplanation(e, check, index)}>
                      {shownExplanations.indexOf(index) === -1 ? 'Zobrazit' : 'Schovat'}
                      {' '}
                      odůvodnění
                    </a>
                  </p>
                  {shownExplanations.indexOf(index) !== -1 &&
                    <p dangerouslySetInnerHTML={{ __html: convertNewlinesToBr(check.explanation) }} />
                  }
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}

const CheckResultBadge = ({ result }) => {
  let label
  let color
  let icon

  switch (result) {
    case 'pravda':
      label = 'Pravda'
      color = '#22ab55'
      icon = 'ok-sign'
      break

    case 'nepravda':
      label = 'Nepravda'
      color = '#ec4f2f'
      icon = 'remove-sign'
      break

    case 'zavadejici':
      label = 'Zavádějící'
      color = '#ec912f'
      icon = 'exclamation-sign'
      break

    case 'neoveritelne':
      label = 'Neověřitelné'
      color = '#227594'
      icon = 'question-sign'
      break
  }

  return (
    <CheckResultBadgeWrapper color={color}>
      <CheckResultBadgeIcon className={`glyphicon glyphicon-${icon}`} />
      {' '}
      {label}
    </CheckResultBadgeWrapper>
  )
}

const CheckResultBadgeWrapper = styled.span`
  background-color: ${props => props.color};
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  padding: 5px 10px 7px 10px;
`

const CheckResultBadgeIcon = styled.span`
  font-size: 20px;
  line-height: 17px;
  top: 4px;
`

const TimeLink = styled.a`
  ${props => props.highlighted && css`
    &, &:hover, &:active, &:focus, &:visited {
      color: #ffffff;
    }
  `}
`

export default Theater
