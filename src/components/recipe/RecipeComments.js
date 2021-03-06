import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addComment } from '../../redux/actions'
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CommentIcon from '@material-ui/icons/CommentRounded';
import TextField from '@material-ui/core/TextField';
import Moment from 'react-moment';
import Divider from '@material-ui/core/Divider';

const styles = theme => ({
  root: {
    width: '100%',
  },
  margin: {
   margin: theme.spacing.unit * 1,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  container: {
   display: 'flex',
   flexWrap: 'wrap',
   width: '100%',
  },
  textField: {
   marginLeft: theme.spacing.unit,
   marginRight: theme.spacing.unit,
   width: '100%',
  },
  commentIcon: {
    marginBottom: 0,
  },
  commentList: {
    width: '100%',
  },
  date: {
    fontSize: 12,
  },
  expansion: {
    display: 'block',
  },
  divider: {
    marginTop: 10,
    marginBottom: 5,
  },
  commentButton: {
    marginTop: 10,
  }
});

class RecipeComments extends Component {
  state = {
    comment: '',
  }

  SubmitHandler = (recipe, user) => {
    let newComment = {
      comment: this.state.comment,
      recipe,
      user
    }
    this.props.addComment(newComment)
    this.setState({comment: ''})
  }

  render() {
    const { classes } = this.props;

    let totalComments = 0
    let commentList = []

  let currComments = [...this.props.comments.filter(comment=> comment.recipe._id === this.props.recipe._id)]

    if (this.props.comments && currComments.length > 0) {
      totalComments = currComments.length
      commentList = currComments.map(comment => {
        const dateToFormat = new Date(comment.created)
        return <div key={comment._id}>
                <p><strong>{comment.user.firstName+" "+comment.user.lastName}</strong> said:</p>
                <p>{comment.comment}</p>
                <p className={classes.date}><Moment fromNow ago>{dateToFormat}</Moment> ago</p>
                <Divider className={classes.divider}/>
              </div>
    })
    }

    return (
      <div>
        <ExpansionPanel >
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>
            <Badge className={classes.margin} badgeContent={totalComments} color="primary">
              <CommentIcon className={classes.commentIcon}/>
            </Badge>
            &nbsp;&nbsp;COMMENTS
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.expansion}>
            <div className={classes.commentList}>
              {commentList.length > 0 ? commentList : <p>Be the first to comment!</p>}
            </div>
            <form className={classes.container} noValidate autoComplete="off">
              <TextField
                id="multiline-static"
                label="Post a Comment"
                multiline
                rows="4"
                value={this.state.comment}
                className={classes.textField}
                onChange={(e)=> this.setState({comment: e.target.value})}
                margin="normal"
              />
              <Button
                variant="contained"
                className={classes.commentButton}
                color="primary"
                onClick={()=> this.SubmitHandler(this.props.recipe._id, this.props.user._id)}>
                Submit Comment
              </Button>
            </form>
          </ExpansionPanelDetails>
        </ExpansionPanel>

      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    comments: state.comments,
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  addComment
}, dispatch)

const RecipeCommentsConnect = connect(mapStateToProps, mapDispatchToProps)(RecipeComments)

export default withStyles(styles)(RecipeCommentsConnect)
