import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from './Header';
import { resettingScore } from '../redux/actions';

class Feedback extends Component {
  componentDidMount() {
    const { score, imagem, name } = this.props;
    let rankingDB = JSON.parse(localStorage.getItem('ranking'));
    if (rankingDB === null) {
      rankingDB = [];
    }
    const ranking = {
      name,
      score,
      picture: imagem,
    };
    const sortedRanking = [...rankingDB, ranking];
    const NUMBER_ONE = 1;
    sortedRanking.sort((a, b) => ((a.score < b.score ? 1 : -NUMBER_ONE)));
    localStorage.setItem('ranking', JSON.stringify(sortedRanking));
  }

  checkCountOfCorretAnswer = () => {
    const { assertions } = this.props;
    const minCount = 3;
    if (assertions < minCount) return 'Could be better...';
    return 'Well Done!';
  };

  handleClickHome = (event) => {
    event.preventDefault();
    const { history, dispatch } = this.props;
    dispatch(resettingScore());
    history.push('/');
  };

  handleClickRanking = (event) => {
    event.preventDefault();
    const { history } = this.props;
    history.push('/ranking');
  };

  render() {
    const { score, assertions } = this.props;
    return (
      <div>
        {/* data-testid="feedback-text" foi retirado por causa do test da page feedback */}
        Feedback
        <Header />
        <section data-testid="feedback-text">
          {this.checkCountOfCorretAnswer()}
        </section>
        <h2 data-testid="feedback-total-score">
          { score }
        </h2>
        <h2 data-testid="feedback-total-question">
          { assertions }
        </h2>
        <button
          data-testid="btn-play-again"
          type="button"
          onClick={ this.handleClickHome }
        >
          Play Again
        </button>
        <button
          data-testid="btn-ranking"
          type="submit"
          onClick={ this.handleClickRanking }
        >
          Ranking
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  assertions: state.player.assertions,
  score: state.player.score,
  imagem: state.player.imagem,
  name: state.player.name,
});

Feedback.propTypes = {
  assertions: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
  imagem: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(Feedback);
