import argparse
import io

from google.cloud import vision
from google.cloud.vision import types

suspicious_labels = ["Gun", "Knife", "Crime", "Violence", "Concealed carry", "Stabbing", "Shooting", "Mask", "Firearm", "Weapon"];


def annotate(path):
    """Returns web annotations given the path to an image."""
    client = vision.ImageAnnotatorClient()

    if path.startswith('http') or path.startswith('gs:'):
        image = types.Image()
        image.source.image_uri = path

    else:
        with io.open(path, 'rb') as image_file:
            content = image_file.read()

        image = types.Image(content=content)

    web_detection = client.web_detection(image=image).web_detection

    return web_detection


def report(annotations):
    """Prints detected features in the provided web annotations."""
    '''if annotations.pages_with_matching_images:
        print('\n{} Pages with matching images retrieved'.format(
            len(annotations.pages_with_matching_images)))

        for page in annotations.pages_with_matching_images:
            print('Url   : {}'.format(page.url))

    if annotations.full_matching_images:
        print('\n{} Full Matches found: '.format(
              len(annotations.full_matching_images)))

        for image in annotations.full_matching_images:
            print('Url  : {}'.format(image.url))

    if annotations.partial_matching_images:
        print('\n{} Partial Matches found: '.format(
              len(annotations.partial_matching_images)))

        for image in annotations.partial_matching_images:
            print('Url  : {}'.format(image.url))'''
    suspiciousObjects = []
    print("\nWeapons/Object detection:")
    if annotations.web_entities:
        #print('\n{} Web entities found: '.format(
        #      len(annotations.web_entities)))
        is_suspicious = False
        for entity in annotations.web_entities:
            if entity.description in suspicious_labels:
                suspiciousObjects.append(entity.description)
                print('Object      : {}'.format(entity.description))
                print('Score : {}'.format(entity.score))
                is_suspicious = True
        if is_suspicious:
            print("Suspicious Photo")
            return suspiciousObjects
        else:
            print("Not-Suspicious Photo")
            return suspiciousObjects

"""
    Method to detect weapons in image
"""
def detectWeaponsInImage(image):
    try:
        return report(annotate(image))
    except FileNotFoundError as e:
        print(e)
        return []
"""
if __name__ == '__main__':
    report(annotate('../resources/ObjectImages/knife-crime.jpg'))
"""