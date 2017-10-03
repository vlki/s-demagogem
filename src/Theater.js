import React, { Component } from 'react'
import YouTube from 'react-youtube'
import ReactTooltip from 'react-tooltip'
import styled, { css } from 'styled-components'

import allData from './data'
import { formatTime, convertNewlinesToBr } from './utils'

const CHECK_PLAYER_TIME_INTERVAL_MS = 200

class Theater extends Component {
  checkInterval = null
  player = null
  checkPanels = {}
  lastScrollTimestamp = null

  constructor(props) {
    super(props)

    this.state = {
      time: null,
      shownExplanations: [],
      discussionData: allData.find(discussion => discussion.path === props.match.path)
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
      let checkIndex = this.state.discussionData.checks.findIndex(check => check.highlightStart >= this.state.time) - 1
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
      this.player.seekTo(check.highlightStart, true)
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
            <div style={{ position: 'fixed' }}>
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
            </div>
          </div>
          <div className="col-xs-4">
            {discussionData.checks.map((check, index) =>
              <div
                key={index}
                ref={checkPanel => this.checkPanels[index] = checkPanel}
                className={'panel ' + (time >= check.highlightStart && time <= check.highlightEnd ? 'panel-primary' : 'panel-default')}
              >
                <div className="panel-heading">
                  <span
                    style={{ display: 'inline-block' }}
                    data-tip={`Kliknutím skočte na čas ${formatTime(check.highlightStart)}`}
                    data-for={`check-${index}`}
                  >
                    <TimeLink
                      highlighted={time >= check.highlightStart && time <= check.highlightEnd}
                      href=""
                      onClick={e => this.handleCheckTimeClick(e, check)}
                    >
                      {formatTime(check.highlightStart)}–{formatTime(check.highlightEnd)}
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
    case 'truth':
      label = 'Pravda'
      color = '#22ab55'
      icon = 'ok-sign'
      break

    case 'untruth':
      label = 'Nepravda'
      color = '#ec4f2f'
      icon = 'remove-sign'
      break

    case 'misleading':
      label = 'Zavádějící'
      color = '#ec912f'
      icon = 'exclamation-sign'
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
