import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { selectComments, selectViews } from '../../redux/blog/blog.selector';
import renderHTML from 'react-render-html';
import comment from '../../assets/comment.svg';
// import view from '../../assets/view.svg';
import './post-preview.scss';
class PostPreview extends React.Component {
  state = {
    setComment: {},
    views: {},
  };
  componentDidMount() {
    this.props.postComments
      .filter(
        (item, index) => item.id === this.props.blog_data.title.toLowerCase()
      )
      .map((comm) => this.setState({ setComment: comm }));
    this.props.postViews
      .filter(
        (item, index) => item.id === this.props.blog_data.title.toLowerCase()
      )
      .map((view) => this.setState({ views: view }));
  }
  render() {
    const { blog_data, showTrunc, closeSearch } = this.props;
    const { title, content, image, tag, updated_at } = blog_data;
    const handleRouting = () => {
      if (closeSearch) {
        this.props.closeSearch();
      }
    };
    const date = new Date(updated_at.seconds * 1000),
      months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      currentMonth = months[date.getMonth()],
      currentDate = date.getDate();
    // year = date.getFullYear(),
    // trunc = truncate.split(' ').slice(0, 12).join(' ');
    let commentLength = 0;
    if (this.state.setComment.comments) {
      this.state.setComment.comments.comments.forEach((comment) => {
        commentLength = commentLength + comment.replies.length;
      });
    }
    return (
      <div className="post-preview">
        <div className="blog-image">
          <img src={image} alt="post img" />
          <button className="date-created">
            {currentDate} <br /> {currentMonth}
          </button>
        </div>

        <div className="blog-info">
          <div
            className="post-preview-header"
            style={showTrunc ? { minHeight: '150px' } : { minHeight: '70px' }}
          >
            <Link
              to={`/blog/${tag}/${title.split(' ').join('-').toLowerCase()}`}
            >
              <h4 className="title" id="post-link" onClick={handleRouting}>
                {title}
              </h4>
            </Link>
            <br />

            <p className="preview-text">
              {renderHTML(content).props
                ? renderHTML(content)
                    .props.children[0].split(' ')
                    .slice(0, 12)
                    .join(' ')
                : renderHTML(content)[0]
                    .props.children[0].split(' ')
                    .slice(0, 12)
                    .join(' ')}
              ... <br />
              <Link
                to={`/blog/${tag.toString().toLowerCase()}/${title
                  .split(' ')
                  .join('-')
                  .toLowerCase()}`}
              >
                <span className="read-more" onClick={handleRouting}>
                  Read More
                </span>
              </Link>
            </p>
          </div>
          <div className="post-footer">
            <span className="post-footer-comment">
              <img src={comment} alt="Comment Icon" />
              {this.state.setComment.comments
                ? commentLength + this.state.setComment.comments.comments.length
                : 0}{' '}
              Comments
            </span>

            <h5 className="tag">
              <span>{tag.replace('_', ' ')}</span>
            </h5>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  postComments: selectComments,
  postViews: selectViews,
});

export default withRouter(connect(mapStateToProps)(PostPreview));
