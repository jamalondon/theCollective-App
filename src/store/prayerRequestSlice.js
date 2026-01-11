import { createSlice } from '@reduxjs/toolkit';
import {
	addComment,
	createPrayerRequest,
	deleteComment,
	deletePrayerRequest,
	getComments,
	getPrayerRequestById,
	getPrayerRequests,
	likePrayerRequest,
	unlikePrayerRequest,
} from './prayerRequestThunk';

const prayerRequestSlice = createSlice({
	name: 'prayerRequest',
	initialState: {
		prayerRequests: [],
		selectedPrayerRequest: null,
		isLoading: false,
		error: null,
		comments: [],
		commentsLoading: false,
		commentsError: null,
	},
	reducers: {
		setPrayerRequests: (state, action) => {
			state.prayerRequests = action.payload;
		},
		setSelectedPrayerRequest: (state, action) => {
			state.selectedPrayerRequest = action.payload;
		},
		clearSelectedPrayerRequest: (state) => {
			state.selectedPrayerRequest = null;
			state.comments = [];
		},
		setIsLoading: (state, action) => {
			state.isLoading = action.payload;
		},
		setError: (state, action) => {
			state.error = action.payload;
		},
		clearError: (state) => {
			state.error = null;
		},
		clearCommentsError: (state) => {
			state.commentsError = null;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(createPrayerRequest.fulfilled, (state, action) => {
			state.prayerRequests.push(action.payload.prayerRequest);
		});
		builder.addCase(createPrayerRequest.rejected, (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
		});
		builder.addCase(createPrayerRequest.pending, (state) => {
			state.isLoading = true;
			state.error = null;
		});
		builder.addCase(getPrayerRequests.fulfilled, (state, action) => {
			state.prayerRequests = action.payload.prayerRequests;
		});
		builder.addCase(getPrayerRequests.rejected, (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
		});
		builder.addCase(getPrayerRequests.pending, (state) => {
			state.isLoading = true;
			state.error = null;
		});
		builder.addCase(getPrayerRequestById.fulfilled, (state, action) => {
			// Update or add the prayer request to the array
			const prayerRequest = action.payload.prayerRequest;
			const index = state.prayerRequests.findIndex(
				(pr) => pr.id === prayerRequest.id
			);
			if (index >= 0) {
				state.prayerRequests[index] = prayerRequest;
			} else {
				state.prayerRequests.push(prayerRequest);
			}
			// Set as selected prayer request for detail view
			state.selectedPrayerRequest = prayerRequest;
			state.isLoading = false;
		});
		builder.addCase(getPrayerRequestById.rejected, (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
		});
		builder.addCase(getPrayerRequestById.pending, (state) => {
			state.isLoading = true;
			state.error = null;
		});
		builder.addCase(deletePrayerRequest.pending, (state) => {
			state.isLoading = true;
			state.error = null;
		});
		builder.addCase(deletePrayerRequest.fulfilled, (state, action) => {
			state.isLoading = false;
			state.error = null;
			const deletedId = action.payload;
			state.prayerRequests = state.prayerRequests.filter(
				(pr) => pr.id !== deletedId
			);
			if (state.selectedPrayerRequest?.id === deletedId) {
				state.selectedPrayerRequest = null;
			}
		});
		builder.addCase(deletePrayerRequest.rejected, (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
		});

		// ==================== PRAYER REQUEST LIKES ====================
		const applyPrayerRequestLikeUpdate = (
			state,
			prayerRequestId,
			liked,
			likeCount
		) => {
			const patch = (pr) => {
				if (!pr || pr.id !== prayerRequestId) return pr;
				const nextLikeCount = likeCount;
				return {
					...pr,
					likedByUser: liked,
					likeCount: nextLikeCount,
				};
			};

			state.prayerRequests = state.prayerRequests.map(patch);
			if (state.selectedPrayerRequest?.id === prayerRequestId) {
				state.selectedPrayerRequest = patch(state.selectedPrayerRequest);
			}
		};

		builder.addCase(likePrayerRequest.fulfilled, (state, action) => {
			applyPrayerRequestLikeUpdate(
				state,
				action.payload.prayerRequestId,
				true,
				action.payload.likeCount
			);
		});

		builder.addCase(unlikePrayerRequest.fulfilled, (state, action) => {
			applyPrayerRequestLikeUpdate(
				state,
				action.payload.prayerRequestId,
				false,
				action.payload.likeCount
			);
		});

		// Comment thunks
		builder.addCase(getComments.pending, (state) => {
			state.commentsLoading = true;
			state.commentsError = null;
		});
		builder.addCase(getComments.fulfilled, (state, action) => {
			state.commentsLoading = false;
			state.comments = action.payload.comments || [];
			state.commentsError = null;
		});
		builder.addCase(getComments.rejected, (state, action) => {
			state.commentsLoading = false;
			state.commentsError = action.payload;
		});

		builder.addCase(addComment.pending, (state) => {
			state.commentsLoading = true;
			state.commentsError = null;
		});
		builder.addCase(addComment.fulfilled, (state, action) => {
			state.commentsLoading = false;
			state.comments.push(action.payload.comment);
			state.commentsError = null;
		});
		builder.addCase(addComment.rejected, (state, action) => {
			state.commentsLoading = false;
			state.commentsError = action.payload;
		});

		builder.addCase(deleteComment.pending, (state) => {
			state.commentsLoading = true;
			state.commentsError = null;
		});
		builder.addCase(deleteComment.fulfilled, (state, action) => {
			state.commentsLoading = false;
			state.comments = state.comments.filter(
				(comment) => comment.id !== action.payload.commentId
			);
			state.commentsError = null;
		});
		builder.addCase(deleteComment.rejected, (state, action) => {
			state.commentsLoading = false;
			state.commentsError = action.payload;
		});
	},
});

export const {
	setPrayerRequests,
	setSelectedPrayerRequest,
	clearSelectedPrayerRequest,
	setIsLoading,
	setError,
	clearError,
	clearCommentsError,
} = prayerRequestSlice.actions;

export default prayerRequestSlice.reducer;
