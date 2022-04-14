/*
 * Generated by @medplum/generator
 * Do not edit manually.
 */

import { Attachment } from './Attachment';
import { Meta } from './Meta';

/**
 * Bot account for automated actions.
 */
export interface Bot {

  /**
   * This is a Bot resource
   */
  readonly resourceType: 'Bot';

  /**
   * The logical id of the resource, as used in the URL for the resource.
   * Once assigned, this value never changes.
   */
  id?: string;

  /**
   * The metadata about the resource. This is content that is maintained by
   * the infrastructure. Changes to the content might not always be
   * associated with version changes to the resource.
   */
  meta?: Meta;

  /**
   * A reference to a set of rules that were followed when the resource was
   * constructed, and which must be understood when processing the content.
   * Often, this is a reference to an implementation guide that defines the
   * special rules along with other profiles etc.
   */
  implicitRules?: string;

  /**
   * The base language in which the resource is written.
   */
  language?: string;

  /**
   * A name associated with the Bot.
   */
  name?: string;

  /**
   * A summary, characterization or explanation of the Bot.
   */
  description?: string;

  /**
   * Image of the bot.
   */
  photo?: Attachment;

  /**
   * Bot logic script.
   */
  code?: string;
}
