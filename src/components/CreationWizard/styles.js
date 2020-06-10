import { createGlobalStyle } from 'styled-components'
import { modalStyles } from '@sangre-fp/ui'

export const previewModalStyles = {
  content: {
    ...modalStyles.content,
    height: '75%',
    width: '80%',
    maxWidth: '1200px',
    padding: '0px',
    background: 'white',
    top: '50%',
    transform: 'translateY(-50%)',
    borderRadius: '2px'
  },
  overlay: {
    ...modalStyles.overlay
  }
}


// !important statements are unfortunately necessary due to overriding drupal styles :(
export const WizardStyles = createGlobalStyle`
  .ReactModal__Content__Wrapper {
    width: 100%;
    height: 100%;
  }
  .wizard {
    min-height: 100vh;
    position: relative;

    &__preview {
      width: 100%;
      height: 100%;

      &__left {
        width: 25%;
        height: 100%;
        padding: 30px;

        label {
          font-size: 12px;
          color: gray;
          font-weight: bold;
        }
      }

      &__right {
        width: 75%;
        height: 100%;
        background: black;
        background: url('https://i.imgur.com/ohmGkwT.png') no-repeat center;
        background-size: cover;
      }
    }

    &__content {
      height: calc(100vh - 112px - 112px - 58px - 10px);
      background-image: url('https://i.imgur.com/ddJN3Qp.jpg');
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;

      &--large {
        height: calc(100vh - 112px)
      }

      &__completion {
        background-color: white;
        box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05), 0 1px 3px 0 rgba(0,0,0,0.05);
        border-radius: 10px;
        padding: 30px 40px;
        max-width: 550px;
        width: 60%;
        margin-top: 80px;
      }

      &__naming-title {
        margin-top: 60px;
      }

      h4 {
        font-size: 1.25rem;
      }

      &__list {
        margin-top: 15px;
        &__item {
          background: white;
          border-radius: 10px;
          box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05), 0 1px 3px 0 rgba(0,0,0,0.05);
          width: 280px;
          height: 330px;
          margin: 0 15px;
          padding: 20px;
          &.active {
            border: 5px solid rgb(33,196,252);
            padding: 15px;
          }

          &__button {
            border: 1px solid rgb(33,196,252);
            color: rgb(33,196,252) !important;

            &.active, &:hover, &:active, &:focus {
              outline: none !important;
              background-color: rgb(33,196,252) !important;
              border: 1px solid rgb(33,196,252) !important;
              color: white !important;
              box-shadow: none !important;
            }
          }

          &__preview {
            color: #006998;
            font-size: 12px;
            i {
              font-size: 17px;
            }
          }
          label {
            font-size: 12px;
            display: block;
            margin-bottom: 0px;
          }
          h4 {
            font-size: 1.25rem;
            margin-bottom: 8px;
          }

          b {
            font-size: 13px;
          }
        }
      }

      &__search {
        width: 65%;
        max-width: 700px;
        margin-top: 60px;
        height: 60px;
        margin-bottom: 25px;
        input {
          height: 60px;
          padding-left: 30px !important;
          font-size: 17px;
        }
        &__clear {
          right: 30px;
          i {
            color: black !important;
          }
        }
      }

      &__search-title {
        /* should be @xtends &__search but not working for some reason */
        width: 65%;
        max-width: 700px;
        margin-top: 10px;
        height: 60px;
        margin-bottom: 25px;
        input {
          height: 60px;
          padding-left: 30px !important;
          font-size: 17px;
        }
        &__clear {
          right: 30px;
          i {
            color: black !important;
          }
        }
      }
    }

    &__navigation {
      margin-top: 15px;
      &__item {
        opacity: 0.4;
        display: flex;
        flex-direction: column;
        padding-left: 2px;
        padding-right: 2px;
        width: 25%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        &.hidden {
          opacity: 0;
        }
        &__label {
          text-transform: uppercase;
          margin-bottom: 0;
          font-size: 11px;
          font-weight: bold;
          color: rgb(100, 114, 129);
        }
        &__text {
          font-weight: bold;
          font-size: 16px;
          width: 100%;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;

          i {
            color: #6fbf40;
            font-size: 17px;
            position: relative;
            top: 2px;
          }
        }
        &__status {
          width: 100%;
          height: 5px;
          background-color: rgb(194,208,215);
          margin-top: 8px;
          &.active {
            background-color: rgb(33, 196, 252);
          }
        }
        &.active {
          opacity: 1;
        }
      }
    }

    &__select {
      width: 220px;
      margin: 0 15px;
      height: 55px;
      border-radius: 35px;

      &__label {
        margin-left: 35px;
      }

      .Select-control {
        height: 100%;
        box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05), 0 1px 3px 0 rgba(0,0,0,0.05);
        border: none;
        border-radius: 30px;
        margin-top: 8px;
      }

      .Select-placeholder {
        padding: 10px 20px !important;
      }

      .Select-arrow-zone {
        padding-right: 20px !important;
      }

      .Select-value {
        padding: 10px 20px !important;
      }

      .Select-menu-outer {
        border: none !important;
        box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05), 0 1px 3px 0 rgba(0,0,0,0.05);
        border-bottom-left-radius: 3px;
        border-bottom-right-radius: 3px;

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-thumb {
          background: #ECECEC;
          border-radius: 20px;
        }

        ::-webkit-scrollbar-track {
          background: white;
          border-radius: 20px;
        }
      }
    }

    &__footer {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 112px;
      width: 100%;
      background-color: white;

      &__button {
        &:disabled {
          background-color: rgb(194,208,215) !important;
          border-color: rgb(194,208,215) !important;
        }
      }

      &__back {
        position: relative;
        color: gray !important;
        border: none !important;
        &:focus {
          box-shadow: none !important;
        }

        &__arrow {
          position: absolute;
          top: 10px;
          left: 0;
        }
      }
    }
  }
`
