import '@brightspace-ui/core/components/button/button-subtle.js';
import { css, html, LitElement } from 'lit-element';
import { announce } from '@brightspace-ui/core/helpers/announce.js';
import { BaseMixin } from '../../mixins/base-mixin.js';
import { bodySmallStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { viewStyles } from './attachment-view-styles.js';

export class AttachmentViewDeleted extends BaseMixin(LitElement) {
	static get properties() {
		return {
			attachment: { type: Object },
			attachmentId: {type: String }
		};
	}

	static get styles() {
		return [
			bodySmallStyles,
			viewStyles,
			css`
				:host {
					display: block;
				}

				#content {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					width: 100%;
					box-sizing: border-box;
				}

				#label {
					margin: 0;
					padding: 7px 12px;
				}

				d2l-button-subtle {
					padding: 7px;
				}
			`,
		];
	}

	_undo() {
		const restoreEvent = new CustomEvent('d2l-attachment-restored', {
			composed: true,
			bubbles: true,
			detail: this.attachmentId,
		});
		this.dispatchEvent(restoreEvent);

		announce(this.localize('aria_restored_attachment', 'attachment_name', this.attachment.name));
	}

	render() {
		return html`
			<div id="content">
				<span id="label" class="d2l-body-small">${this.localize('attachment_removed')}</span>
				<d2l-button-subtle
					id="button"
					class="undo-button"
					aria-label="${this.localize('aria_undo_attachment', 'attachment_name', this.attachment.name)}"
					text="${this.localize('undo')}"
					@click="${this._undo}">
				</d2l-button-subtle>
			</div>
		`;
	}

	async firstUpdated() {
		const button = this.shadowRoot.getElementById('button');
		if (button) {
			if (button.updateComplete) {
				await button.updateComplete;
			}
			button.focus();
		}
	}
}

window.customElements.define('d2l-labs-attachment-view-deleted', AttachmentViewDeleted);
